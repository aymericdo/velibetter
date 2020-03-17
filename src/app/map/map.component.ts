import { Component, Input } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { LatLngBounds, LatLngBoundsLiteral } from '@agm/core/services/google-maps-types';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { Router, NavigationEnd } from '@angular/router';
import { getIsLoading, getMarkers, getLatLngBoundsLiteral, getSelectedStation } from '../reducers/stations-map';
import { getCurrentPosition } from '../reducers/position';
import { fetchingStationsInPolygon, unselectStationMap, initialFetchingStationsInPolygon } from '../actions/stations-map';
import { fetchingDestination, unsetDestination } from '../actions/stations-list';
import { getDestination } from '../reducers/stations-list';
import { take, filter, map } from 'rxjs/operators';
import { Station, Marker } from '../interfaces';
import { Coordinate } from '../interfaces/index';

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
