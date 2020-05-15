import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { setDegrees, setIsNoGeolocation, setPosition, toggleCompassView } from './actions/galileo';
import { setIsFullMap, setRouteName, setUrl } from './actions/route';
import { setIsMobile } from './actions/screen';
import { animationSpeed, animationType, routerTransition } from './animations/route-animations';
import { AppState } from './reducers';
import { getDegrees, getIsCompassView } from './reducers/galileo';
import { getIsSplitScreen } from './reducers/route';
import { getIsMobile } from './reducers/screen';
import { DEFAULT_COORD } from './shared/constants';

declare const gtag: (
  event: string,
  eventName: string,
  options: {
    page_path: string,
  },
) => void;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerTransition],
})
export class AppComponent implements OnInit, OnDestroy {
  isMobile$: Observable<boolean>;
  deg$: Observable<number>;
  isCompassView$: Observable<boolean>;
  isFullMap$: Observable<boolean>;

  isIOS = false;
  mapTransition = `opacity ${animationSpeed} ${animationType}, width ${animationSpeed} ${animationType}`;

  private deviceOrientationListener: () => void = null;
  private watcher: number = null;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private renderer: Renderer2,
    private snackBar: MatSnackBar,
  ) {
    this.isMobile$ = store.pipe(select(getIsMobile));
    this.deg$ = store.pipe(select(getDegrees));
    this.isCompassView$ = store.pipe(select(getIsCompassView));
    this.isFullMap$ = store.pipe(select(getIsSplitScreen));
  }

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
    ).subscribe((event: NavigationEnd) => {
      gtag('config', 'UA-166127239-1', {
        page_path: event.urlAfterRedirects
      });
      const routeName = this.getRouteVariables('routeName') as string;
      const isFullMap = this.getRouteVariables('isFullMap') as boolean;
      this.store.dispatch(setUrl({ url: event.url }));
      this.store.dispatch(setRouteName({ routeName }));
      this.store.dispatch(setIsFullMap({ isFullMap }));
    });
  }

  ngOnDestroy(): void {
    navigator.geolocation.clearWatch(this.watcher);
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getRouteVariables(name: string): string | boolean {
    let child = this.activatedRoute.firstChild;
    while (child) {
      if (child.firstChild) {
        child = child.firstChild;
      } else if (child.snapshot.data && child.snapshot.data[name]) {
        return child.snapshot.data[name];
      } else {
        return null;
      }
    }
    return null;
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
        this.store.dispatch(
          setIsNoGeolocation({
            isNoGeolocation: true,
          })
        );
        // ...device can't get data
        break;
      case 1:
        this.store.dispatch(
          setIsNoGeolocation({
            isNoGeolocation: true,
          })
        );
        break;
      // ...user said no ☹️
    }
  }
}
