import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  fetchingClosestStationsInfo
} from './actions/stations';
import { Store, select } from '@ngrx/store';
import { AppState } from './reducers';
import { isLoading, markers, Marker } from './reducers/stations';
import { Observable } from 'rxjs';
import { setPosition } from './actions/position';
import { currentPosition } from './reducers/position';
import { LatLngBounds } from '@agm/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { setIsMobile } from './actions/screen';
import { isMobile } from './reducers/screen';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Velibetter';
  markers$: Observable<Marker[]>;
  isLoading$: Observable<boolean>;
  currentPosition$: Observable<{ lat: number; lng: number }>;
  isMobile$: Observable<boolean>;

  watcher: number = null;
  currentLatLngBounds: LatLngBounds;

  fabButtons = [{
    id: 0,
    icon: 'directions_bike',
  }, {
    id: 1,
    icon: 'lock',
  }];

  // Châtelet
  defaultCoord = { lat: 48.859889, lng: 2.346878 };
  zoom = 16;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.isLoading$ = store.pipe(select(isLoading));
    this.markers$ = store.pipe(select(markers));
    this.currentPosition$ = store.pipe(select(currentPosition));
    this.isMobile$ = store.pipe(select(isMobile));
  }

  ngOnInit() {
    this.watcher = navigator.geolocation.watchPosition(
      this.displayLocationInfo,
      this.handleLocationError,
      { timeout: 0 }
    );

    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
    ]).subscribe((result: BreakpointState) => {
      if (result.matches) {
        this.store.dispatch(setIsMobile({ isMobile: true }));
      } else {
        this.store.dispatch(setIsMobile({ isMobile: false }));
      }
    });
  }

  ngOnDestroy(): void {
    navigator.geolocation.clearWatch(this.watcher);
  }

  displayLocationInfo = (position: Position) => {
    if (position) {
      this.store.dispatch(
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      );
    }
  }

  handleLocationError = error => {
    switch (error.code) {
      case 3:
        // timeout was hit, meaning nothing's in the cache
        // let's provide a default location:
        this.displayLocationInfo({
          coords: {
            longitude: this.defaultCoord.lng,
            latitude: this.defaultCoord.lat
          }
        } as Position);

        // now let's make a non-cached request to get the actual position
        navigator.geolocation.getCurrentPosition(
          this.displayLocationInfo,
          this.handleLocationError
        );
        break;
      case 2:
        // ...device can't get data
        break;
      case 1:
      // ...user said no ☹️
    }
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
