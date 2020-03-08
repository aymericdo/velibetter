import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LatLngBounds } from '@agm/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { Router } from '@angular/router';
import { isLoading, markers, Marker } from '../reducers/station-info';
import { currentPosition } from '../reducers/position';
import { fetchingClosestStationsInfo } from '../actions/station-info';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
  markers$: Observable<Marker[]>;
  isLoading$: Observable<boolean>;
  currentPosition$: Observable<{ lat: number; lng: number }>;

  // Châtelet
  defaultCoord = { lat: 48.859889, lng: 2.346878 };
  zoom = 16;
  currentLatLngBounds: LatLngBounds;

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
