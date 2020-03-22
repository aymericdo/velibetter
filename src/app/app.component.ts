import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from './reducers';
import { Observable } from 'rxjs';
import { setPosition, setDegrees } from './actions/position';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { setIsMobile } from './actions/screen';
import { getIsMobile } from './reducers/screen';
import { getDegrees } from './reducers/position';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.isMobile$ = store.pipe(select(getIsMobile));
    this.deg$ = store.pipe(select(getDegrees));
  }

  title = 'Velibetter';
  isMobile$: Observable<boolean>;
  deg$: Observable<number>;

  watcher: number = null;
  isNotMainRoute: boolean;

  // Châtelet
  defaultCoord = { lat: 48.859889, lng: 2.346878 };

  @HostListener('window:deviceorientation', ['$event'])
  onResize(event: DeviceOrientationEvent) {
    this.store.dispatch(setDegrees({ deg: event.alpha }));
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

  handleOrientation = (event: DeviceOrientationEvent): void => {
    this.store.dispatch(setDegrees({ deg: event.alpha }));
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
          },
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

  back(): void {
    if (['departure', 'arrival'].includes(this.router.url.split('/')[1]) && this.router.url.split('/').length > 2) {
      this.router.navigate([this.router.url.split('/')[1]]);
    } else if (['departure', 'arrival'].includes(this.router.url.split('/')[1])) {
      this.router.navigate(['/']);
    } else if (['stations'].includes(this.router.url.split('/')[1]) && this.router.url.split('/').length > 2) {
      this.router.navigate(['/']);
    }
  }

  isMainRoute(): boolean {
    return this.router.url === '/';
  }

  isDisplayingListPages(): boolean {
    return this.router.url === '/arrival'
      || this.router.url === '/departure'
      || (this.router.url.split('/').length > 1 && this.router.url.split('/')[1] === 'stations');
  }
}
