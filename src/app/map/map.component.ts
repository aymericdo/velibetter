import { LatLngBounds, LatLngBoundsLiteral } from '@agm/core/services/google-maps-types';
import { Component, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { fetchingDestination, unsetDestination } from '../actions/stations-list';
import { fetchingStationsInPolygon, initialFetchingStationsInPolygon, setMapCenter, unselectStationMap } from '../actions/stations-map';
import { Marker, Station } from '../interfaces';
import { Coordinate } from '../interfaces/index';
import { AppState } from '../reducers';
import { getCurrentPosition } from '../reducers/position';
import { getDestination } from '../reducers/stations-list';
import { getIsLoading, getLatLngBoundsLiteral, getMapCenter, getMarkers, getSelectedStation } from '../reducers/stations-map';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
  @Input() isDisplayingListPages: boolean;
  @Input() defaultCoord: Coordinate;

  markers$: Observable<Marker[]>;
  isLoading$: Observable<boolean>;
  currentPosition$: Observable<{ lat: number; lng: number }>;
  destination$: Observable<{ lat: number; lng: number }>;
  latLngBoundsLiteral$: Observable<LatLngBoundsLiteral>;
  selectedStation$: Observable<Station>;
  mapCenter$: Observable<Coordinate>;

  currentMapCenter: Coordinate;
  zoom = 16;
  currentLatLngBounds: LatLngBounds;
  travelMode: string;

  fabButtons = [{
    id: 0,
    icon: 'directions_bike',
  }, {
    id: 1,
    icon: 'lock',
  }];

  firstLoadDone = false;

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
    let currentPosition;
    this.currentPosition$.pipe(take(1)).subscribe((c) => {
      currentPosition = c;
    });
    this.store.dispatch(setMapCenter(currentPosition || this.defaultCoord));
  }

  boundsChange(event: LatLngBounds) {
    this.currentLatLngBounds = event;
  }

  idle() {
    if (this.currentLatLngBounds) {
      let latLngBoundsLiteralLastSaved;
      this.latLngBoundsLiteral$.pipe(take(1)).subscribe(latLng => latLngBoundsLiteralLastSaved = latLng);

      if (JSON.stringify(latLngBoundsLiteralLastSaved) !== JSON.stringify(this.currentLatLngBounds.toJSON())) {
        if (this.firstLoadDone) {
          this.store.dispatch(
            fetchingStationsInPolygon({
              latLngBoundsLiteral: this.currentLatLngBounds.toJSON(),
            }),
          );
        } else {
          this.firstLoadDone = true;
          this.store.dispatch(
            initialFetchingStationsInPolygon({
              latLngBoundsLiteral: this.currentLatLngBounds.toJSON(),
            }),
          );
        }
      }
    }
    this.store.dispatch(
        setMapCenter(this.currentMapCenter)
    );
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
    let currentPosition;
    this.currentPosition$.pipe(take(1)).subscribe((c) => {
      currentPosition = c;
    });
    this.store.dispatch(setMapCenter(currentPosition));
  }

  centerChange(center) {
    this.currentMapCenter = center;
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
