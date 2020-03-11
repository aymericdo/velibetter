import { Component } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { LatLngBounds, LatLngBoundsLiteral } from '@agm/core/services/google-maps-types';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { Router, NavigationEnd } from '@angular/router';
import { isLoading, markers, latLngBoundsLiteral, selectedStation } from '../reducers/stations-map';
import { currentPosition } from '../reducers/position';
import { fetchingStationsInPolygon, selectStationMap, unselectStationMap } from '../actions/stations-map';
import { fetchingDestination } from '../actions/stations-list';
import { destination } from '../reducers/stations-list';
import { take, filter, map } from 'rxjs/operators';
import { Station, Marker } from '../interfaces';

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
  latLngBoundsLiteral$: Observable<LatLngBoundsLiteral>;
  selectedStation$: Observable<Station>;

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
    this.destination$ = store.pipe(select(destination));
    this.latLngBoundsLiteral$ = store.pipe(select(latLngBoundsLiteral));
    this.selectedStation$ = store.pipe(select(selectedStation));

    combineLatest([
      this.currentPosition$.pipe(filter(Boolean)),
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
      this.travelMode = val.url.split('/')[1] === 'departure' ? 'WALKING' : 'BICYCLING';
      this.store.dispatch(fetchingDestination({ stationId: +val.url.split('/')[2] }));
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
        this.store.dispatch(
          fetchingStationsInPolygon({
            latLngBoundsLiteral: this.currentLatLngBounds.toJSON(),
          }),
        );
      }
    }
  }

  clickedMarker(stationId: number) {
    this.store.dispatch(selectStationMap({ stationId }));
  }

  unselectStation() {
    this.store.dispatch(unselectStationMap());
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
