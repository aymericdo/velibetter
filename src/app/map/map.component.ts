import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LatLngBounds } from '@agm/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { Router, NavigationEnd } from '@angular/router';
import { isLoading, markers, Marker } from '../reducers/station-info';
import { currentPosition } from '../reducers/position';
import { fetchingClosestStationsInfo } from '../actions/station-info';
import { direction } from '../reducers/station-status';
import { fetchingDestination } from '../actions/station-status';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
  markers$: Observable<Marker[]>;
  isLoading$: Observable<boolean>;
  currentPosition$: Observable<{ lat: number; lng: number }>;
  destination$: Observable<{ lat: number; lng: number }>;

  // Châtelet
  defaultCoord = { lat: 48.859889, lng: 2.346878 };
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

  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) {
    this.markers$ = store.pipe(select(markers));
    this.isLoading$ = store.pipe(select(isLoading));
    this.currentPosition$ = store.pipe(select(currentPosition));
    this.destination$ = store.pipe(select(direction));
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (val.url.split('/').length > 2 && ['departure', 'arrival'].includes(val.url.split('/')[1])) {
          this.travelMode = val.url.split('/')[1] === 'departure' ? 'WALKING' : 'BICYCLING';
          this.store.dispatch(fetchingDestination({ stationId: +val.url.split('/')[2] }));
        }
      }
    });
  }

  boundsChange(event: LatLngBounds) {
    this.currentLatLngBounds = event;
  }

  idle() {
    if (this.currentLatLngBounds) {
      this.store.dispatch(
        fetchingClosestStationsInfo({
          latLngBoundsLiteral: this.currentLatLngBounds.toJSON()
        })
      );
    }
  }

  trackByFn(index: number, marker: Marker): number {
    return marker.id;
  }

  isDisplayingListPages(): boolean {
    return this.router.url === '/arrival' || this.router.url === '/departure';
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
