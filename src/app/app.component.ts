import { Component, OnDestroy, OnInit, HostListener, Renderer2 } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from './reducers';
import { Observable, Subject } from 'rxjs';
import { setPosition, setDegrees, toggleCompassView } from './actions/galileo';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { setIsMobile } from './actions/screen';
import { getIsMobile } from './reducers/screen';
import { getDegrees } from './reducers/galileo';
import { getIsCompassView } from './reducers/galileo';
import { takeUntil, filter, map } from 'rxjs/operators';
import { DEFAULT_COORD } from './shared/constants';
import { setRouteName } from './actions/route';
import { getRouteName } from './reducers/route';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private renderer: Renderer2,
  ) {
    this.isMobile$ = store.pipe(select(getIsMobile));
    this.deg$ = store.pipe(select(getDegrees));
    this.isCompassView$ = store.pipe(select(getIsCompassView));
    this.routeName$ = store.pipe(select(getRouteName));
  }

  title = 'Velibetter';
  isMobile$: Observable<boolean>;
  deg$: Observable<number>;
  isCompassView$: Observable<boolean>;
  routeName$: Observable<string>;

  isIOS = false;

  private deviceOrientationListener: () => void = null;
  private watcher: number = null;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit() {
    this.isIOS = ((/iPad|iPhone|iPod/.test(navigator.userAgent)) && (typeof (DeviceMotionEvent as any).requestPermission === 'function'));

    this.watcher = navigator.geolocation.watchPosition(
      this.displayLocationInfo,
      this.handleLocationError,
      { enableHighAccuracy: true, timeout: 0 }
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

    this.isCompassView$.pipe(takeUntil(this.destroy$))
      .subscribe((isCompassView) => {
        if (isCompassView) {
          this.deviceOrientationListener =
            this.renderer.listen('window', 'deviceorientation', (event: DeviceOrientationEvent) => {
              this.store.dispatch(setDegrees({ deg: event.alpha }));
            });
        } else {
          if (this.deviceOrientationListener) {
            this.deviceOrientationListener();
          }
        }
      });

    this.router.events.pipe(
      filter(event =>
        event instanceof NavigationEnd
      ),
      map(() => {
        let child = this.activatedRoute.firstChild;
        while (child) {
          if (child.firstChild) {
            child = child.firstChild;
          } else if (child.snapshot.data && child.snapshot.data.routeName) {
            return child.snapshot.data.routeName;
          } else {
            return null;
          }
        }
        return null;
      })
    ).subscribe((routeName: string) => {
      this.store.dispatch(setRouteName({ routeName }));
    });
  }

  ngOnDestroy(): void {
    navigator.geolocation.clearWatch(this.watcher);
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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

  // for requesting permission on iOS 13 devices
  requestPermissionsIOS() {
    this.requestDeviceOrientationIOS();
  }

  // requesting device orientation permission
  requestDeviceOrientationIOS() {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permissionState: 'granted' | 'denied' | 'default') => {
          if (permissionState === 'granted') {
            this.store.dispatch(toggleCompassView());
          }
        })
        .catch(console.error);
    } else {
      // handle regular non iOS 13+ devices
    }
  }

  handleLocationError = (error) => {
    switch (error.code) {
      case 3:
        // timeout was hit, meaning nothing's in the cache
        // let's provide a default location:

        this.displayLocationInfo({
          coords: {
            longitude: DEFAULT_COORD.lng,
            latitude: DEFAULT_COORD.lat
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

  isDisplayingListPages(routeName: string): boolean {
    return ([
      'StationDescription',
      'Departure',
      'Arrival',
      'DepartureItineraryDescription',
      'ArrivalItineraryDescription',
    ].includes(routeName));
  }
}
