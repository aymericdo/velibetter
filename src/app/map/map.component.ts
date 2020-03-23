import { LatLngBounds, LatLngBoundsLiteral } from '@agm/core/services/google-maps-types';
import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { fetchingDestination, unsetDestination } from '../actions/stations-list';
import {
  fetchingStationsInPolygon,
  setMapCenter, setZoom, unselectStationMap,
 } from '../actions/stations-map';
import { Marker, Station } from '../interfaces';
import { Coordinate } from '../interfaces/index';
import { AppState } from '../reducers';
import { getCurrentPosition } from '../reducers/position';
import { getDestination } from '../reducers/stations-list';
import { getIsLoading, getLatLngBoundsLiteral, getMapCenter, getMarkers, getSelectedStation, getZoom } from '../reducers/stations-map';
import { isEqual } from 'lodash';
import { toggleCompassView } from '../actions/position';

// Châtelet
export const DEFAULT_COORD = { lat: 48.859889, lng: 2.346878 };
const DEFAULT_ZOOM = 16;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  @Input() isDisplayingListPages: boolean;
  @Input() isIOS: boolean;
  @Output() requestPermissionsIOS = new EventEmitter<any>();

  markers$: Observable<Marker[]>;
  isLoading$: Observable<boolean>;
  currentPosition$: Observable<{ lat: number; lng: number }>;
  destination$: Observable<{ lat: number; lng: number }>;
  latLngBoundsLiteral$: Observable<LatLngBoundsLiteral>;
  selectedStation$: Observable<Station>;
  mapCenter$: Observable<Coordinate>;
  zoom$: Observable<number>;

  travelMode: string;
  compassView = false;

  fabButtons = [{
    id: 0,
    icon: 'directions_bike',
  }, {
    id: 1,
    icon: 'lock',
  }];

  private currentMapCenter: Coordinate;
  private currentLatLngBounds: LatLngBounds;
  private currentZoom = DEFAULT_ZOOM;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) {
    this.markers$ = store.pipe(select(getMarkers));
    this.isLoading$ = store.pipe(select(getIsLoading));
    this.currentPosition$ = store.pipe(select(getCurrentPosition));
    this.destination$ = store.pipe(select(getDestination));
    this.latLngBoundsLiteral$ = store.pipe(select(getLatLngBoundsLiteral));
    this.selectedStation$ = store.pipe(select(getSelectedStation));
    this.mapCenter$ = store.pipe(select(getMapCenter));
    this.zoom$ = store.pipe(select(getZoom));

    combineLatest([
      this.currentPosition$.pipe(filter(Boolean), take(1)),
      router.events.pipe(
        filter(event =>
          event instanceof NavigationEnd
          && event.url.split('/').length > 1
          && ['departure', 'arrival'].includes(event.url.split('/')[1]),
        )
      ),
    ]).pipe(
      map(([position, val]) => val),
    ).subscribe((val: NavigationEnd) => {
      if (val.url.split('/').length > 2) {
        this.travelMode = val.url.split('/')[1] === 'departure' ? 'WALKING' : 'BICYCLING';
        this.store.dispatch(fetchingDestination({ stationId: +val.url.split('/')[2] }));
      } else {
        this.store.dispatch(unsetDestination());
      }
    });
  }

  ngOnInit() {
    this.currentPosition$.pipe(takeUntil(this.destroy$)).subscribe((currentPosition) => {
      this.store.dispatch(setMapCenter(currentPosition || DEFAULT_COORD));
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  boundsChange(event: LatLngBounds) {
    this.currentLatLngBounds = event;
  }

  idle() {
    this.store.dispatch(
      setMapCenter(this.currentMapCenter)
    );
    this.store.dispatch(
      setZoom({ zoom: this.currentZoom })
    );

    if (this.currentLatLngBounds) {
      let latLngBoundsLiteralLastSaved;
      this.latLngBoundsLiteral$.pipe(take(1)).subscribe(latLng => latLngBoundsLiteralLastSaved = latLng);

      if (!isEqual(latLngBoundsLiteralLastSaved, this.currentLatLngBounds)) {
          this.store.dispatch(
            fetchingStationsInPolygon({
              latLngBoundsLiteral: this.currentLatLngBounds.toJSON(),
            }),
          );
      }
    }
  }

  clickedMarker(stationId: number): void {
    this.router.navigate(['stations', stationId]);
  }

  unselectStation() {
    this.store.dispatch(unselectStationMap());
  }

  trackByFn(index: number, marker: Marker): number {
    return marker.id;
  }

  recenterMap() {
    let position: Coordinate;
    let zoom: number;
    let mapCenter: Coordinate;
    this.currentPosition$.pipe(take(1)).subscribe((cp) => { position = cp; });
    this.zoom$.pipe(take(1)).subscribe((z) => { zoom = z; });
    this.mapCenter$.pipe(take(1)).subscribe((mc) => { mapCenter = mc; });

    if (!isEqual(mapCenter, position) || zoom !== DEFAULT_ZOOM) {
      this.store.dispatch(setMapCenter(position));
      this.store.dispatch(setZoom({ zoom: DEFAULT_ZOOM }));
    } else {
      if (this.isIOS) {
        this.requestPermissionsIOS.emit();
      } else {
        this.store.dispatch(toggleCompassView());
      }
    }
  }

  centerChange(center) {
    this.currentMapCenter = center;
  }

  zoomChange(zoom) {
    this.currentZoom = zoom;
  }

  navigateTo(id: number): void {
    switch (id) {
      case 0: {
        this.router.navigate(['departure']); break;
      }

      case 1: {
        this.router.navigate(['arrival']); break;
      }
    }
  }
}
