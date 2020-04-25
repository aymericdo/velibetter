import { LatLngBounds, LatLngBoundsLiteral } from '@agm/core/services/google-maps-types';
import { Component, Input, OnDestroy, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { fetchingDestination, unsetDestination } from '../actions/stations-list';
import {
  fetchingStationsInPolygon,
  setMapCenter, setZoom, resetZoom,
 } from '../actions/stations-map';
import { Marker, Station } from '../interfaces';
import { Coordinate } from '../interfaces/index';
import { AppState } from '../reducers';
import { getCurrentPosition, getIsCompassView, getCurrentBearing } from '../reducers/galileo';
import { getDestination, getTravelMode } from '../reducers/stations-list';
import { getIsLoading, getLatLngBoundsLiteral, getMapCenter, getMarkers, getSelectedStation, getZoom } from '../reducers/stations-map';
import { toggleCompassView } from '../actions/galileo';
import { isEqual } from 'lodash';
import { DEFAULT_ZOOM, DEFAULT_COORD } from '../shared/constants';
import { getRouteName } from '../reducers/route';

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
  isCompassView$: Observable<boolean>;
  currentBearing$: Observable<number>;
  routeName$: Observable<string>;
  travelMode$: Observable<string>;

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
  private isViewSyncWithCurrentPosition = true;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private elRef: ElementRef,
  ) {
    this.markers$ = store.pipe(select(getMarkers));
    this.isLoading$ = store.pipe(select(getIsLoading));
    this.currentPosition$ = store.pipe(select(getCurrentPosition));
    this.destination$ = store.pipe(select(getDestination));
    this.latLngBoundsLiteral$ = store.pipe(select(getLatLngBoundsLiteral));
    this.selectedStation$ = store.pipe(select(getSelectedStation));
    this.mapCenter$ = store.pipe(select(getMapCenter));
    this.zoom$ = store.pipe(select(getZoom));
    this.isCompassView$ = store.pipe(select(getIsCompassView));
    this.currentBearing$ = store.pipe(select(getCurrentBearing));
    this.routeName$ = store.pipe(select(getRouteName));
    this.travelMode$ = store.pipe(select(getTravelMode));

    const isItineraryRoute = (route: string) => [
      'StationDescription',
      'StationDescriptionFeedback',
      'DepartureItinerary',
      'DepartureItineraryDescription',
      'DepartureItineraryDescriptionFeedback',
      'ArrivalItinerary',
      'ArrivalItineraryDescription',
      'ArrivalItineraryDescriptionFeedback',
    ].includes(route);

    combineLatest([
      this.currentPosition$.pipe(filter(Boolean), take(1)),
      router.events.pipe(
        filter(event =>
          event instanceof NavigationEnd
          && event.url.split('/').length > 2
          && ['departure', 'arrival'].includes(event.url.split('/')[1]),
        )
      ),
    ]).pipe(
      map(([position, val]) => val),
    ).subscribe((val: NavigationEnd) => {
      this.store.dispatch(fetchingDestination({ travelMode: val.url.split('/')[1], stationId: +val.url.split('/')[2] }));
    });

    combineLatest([
      this.currentPosition$.pipe(filter(Boolean), take(1)),
      this.routeName$,
    ]).pipe(
      filter(([position, name]) => !!name && !isItineraryRoute(name)),
      takeUntil(this.destroy$),
    ).subscribe(() => {
      this.store.dispatch(unsetDestination());
    });
  }

  ngOnInit() {
    this.currentPosition$.pipe(takeUntil(this.destroy$)).subscribe((currentPosition) => {
      if (this.isViewSyncWithCurrentPosition) {
        this.store.dispatch(setMapCenter({
          lat: currentPosition ? currentPosition.lat : DEFAULT_COORD.lat,
          lng: currentPosition ? currentPosition.lng : DEFAULT_COORD.lng,
        }));
      }
    });

    this.currentBearing$.pipe(takeUntil(this.destroy$)).subscribe((currentBearing) => {
      const icons = [...this.elRef.nativeElement.querySelectorAll('agm-map > div.agm-map-container-inner.sebm-google-map-container-inner > div > div > div:nth-child(1) > div > div:nth-child(4) > div > img')];
      if (icons && icons.length) {
        const icon = icons.find(ic => {
          const array = ic.src.split('/');
          return array[array.length - 1] === 'compass_calibration.svg';
        });

        if (icon) {
          icon.style.transform = `rotate(${currentBearing * -1}deg)`;
        }
      }
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
    this.store.dispatch(setMapCenter({
      lat: this.currentMapCenter ? this.currentMapCenter.lat : DEFAULT_COORD.lat,
      lng: this.currentMapCenter ? this.currentMapCenter.lng : DEFAULT_COORD.lng,
    }));
    this.store.dispatch(setZoom({ zoom: this.currentZoom }));

    this.isViewSyncWithCurrentPosition = this.isMapCenterEqualCurrentPosition();

    if (this.currentLatLngBounds) {
      let latLngBoundsLiteralLastSaved: LatLngBoundsLiteral;
      this.latLngBoundsLiteral$.pipe(take(1)).subscribe((latLng: LatLngBoundsLiteral) => {
        latLngBoundsLiteralLastSaved = latLng;
      });

      if (!isEqual(latLngBoundsLiteralLastSaved, this.currentLatLngBounds.toJSON())
        && !this.isFlatMap(this.currentLatLngBounds.toJSON())) {
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

  trackByFn(index: number, marker: Marker): number {
    return marker.id;
  }

  recenterMap() {
    if (this.isViewSyncWithCurrentPosition) {
      if (this.isIOS) {
        this.requestPermissionsIOS.emit();
      } else {
        this.store.dispatch(toggleCompassView());
      }
    } else {
      let position: Coordinate;
      this.currentPosition$.pipe(take(1)).subscribe((cp) => { position = cp; });
      this.store.dispatch(setMapCenter(position));
      this.store.dispatch(resetZoom());
    }
  }

  centerChange(center: Coordinate): void {
    this.currentMapCenter = center;
  }

  zoomChange(zoom: number): void {
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

  isFlatMap(latLng: LatLngBoundsLiteral): boolean {
    return latLng.north === latLng.south && latLng.east === latLng.west;
  }

  showTopBar(routeName: string): boolean {
    return ([
      'DepartureItinerary',
      'ArrivalItinerary',
    ].includes(routeName));
  }

  onBack(): void {
    let travelMode: string;
    this.travelMode$.pipe(take(1))
      .subscribe((mode) => {
        travelMode = mode;
      });

    if (travelMode) {
      this.router.navigate([travelMode]);
    }
  }

  goToDescription(): void {
    this.router.navigate([this.router.url.split('/')[1], this.router.url.split('/')[2], 'description']);
  }

  isMapCenterEqualCurrentPosition(): boolean {
    let position: Coordinate;
    this.currentPosition$.pipe(take(1)).subscribe((cp) => { position = cp; });
    let zoom: number;
    this.zoom$.pipe(take(1)).subscribe((z) => { zoom = z; });
    let mapCenter: Coordinate;
    this.mapCenter$.pipe(take(1)).subscribe((mc) => { mapCenter = mc; });
    return isEqual(mapCenter, DEFAULT_COORD) || isEqual(mapCenter, position) && zoom === DEFAULT_ZOOM;
  }
}
