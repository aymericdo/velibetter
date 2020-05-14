import {
  LatLngBounds,
  LatLngBoundsLiteral
} from '@agm/core/services/google-maps-types';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  select,
  Store
} from '@ngrx/store';
import {
  isEqual
} from 'lodash';
import {
  Observable,
  Subject
} from 'rxjs';
import {
  take,
  takeUntil
} from 'rxjs/operators';
import {
  toggleCompassView
} from '../actions/galileo';
import {
  fetchingStationsInPolygon,
  resetZoom,
  setMapCenter,
  setZoom
} from '../actions/stations-map';
import {
  Marker,
  Station
} from '../interfaces';
import {
  Coordinate
} from '../interfaces/index';
import {
  AppState
} from '../reducers';
import {
  getCurrentBearing,
  getCurrentPosition,
  getIsCompassView
} from '../reducers/galileo';
import {
  getRouteName
} from '../reducers/route';
import {
  getDestination,
  getItineraryType,
  ItineraryType
} from '../reducers/stations-list';
import {
  getIsLoading,
  getLatLngBoundsLiteral,
  getMapCenter,
  getMarkers,
  getSelectedStation,
  getZoom
} from '../reducers/stations-map';
import {
  DEFAULT_COORD,
  DEFAULT_ZOOM
} from '../shared/constants';
import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { notifyCompassView } from '../shared/helper';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  @Input() isDisplayingListPages: boolean;
  @Input() isIOS: boolean;
  @Input() isHide: boolean;
  @Output() requestPermissionsIOS = new EventEmitter<void>();

  markers$: Observable<Marker[]>;
  isLoading$: Observable<boolean>;
  currentPosition$: Observable<{
    lat: number; lng: number
  }>;
  destination$: Observable<Station>;
  latLngBoundsLiteral$: Observable<LatLngBoundsLiteral>;
  selectedStation$: Observable<Station>;
  mapCenter$: Observable<Coordinate>;
  zoom$: Observable<number>;
  isCompassView$: Observable<boolean>;
  currentBearing$: Observable<number>;
  routeName$: Observable<string>;
  itineraryType$: Observable<ItineraryType>;

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
  isCompassUncertain = true;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private elRef: ElementRef,
    private snackBar: MatSnackBar,
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
    this.itineraryType$ = store.pipe(select(getItineraryType));
    this.routeName$ = store.pipe(select(getRouteName));
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
      const iconSelector = 'agm-map > div.agm-map-container-inner.sebm-google-map-container-inner >' +
        ' div > div > div:nth-child(1) > div > div:nth-child(4) > div > img';

      const icons = [
        ...this.elRef.nativeElement.querySelectorAll(iconSelector),
      ];

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
    this.store.dispatch(setZoom({
      zoom: this.currentZoom
    }));

    this.isViewSyncWithCurrentPosition = this.isMapCenterEqualCurrentPosition();

    if (this.currentLatLngBounds) {
      let latLngBoundsLiteralLastSaved: LatLngBoundsLiteral;
      this.latLngBoundsLiteral$.pipe(take(1)).subscribe((latLng: LatLngBoundsLiteral) => {
        latLngBoundsLiteralLastSaved = latLng;
      });

      if (!isEqual(latLngBoundsLiteralLastSaved, this.currentLatLngBounds.toJSON()) &&
        !this.isFlatMap(this.currentLatLngBounds.toJSON())) {
        this.store.dispatch(
          fetchingStationsInPolygon({
            latLngBoundsLiteral: this.currentLatLngBounds.toJSON(),
          }),
        );
      }
    }
  }

  clickedMarker(stationId: number): void {
    const destination: Station = this.getDestination();

    if (destination) {
      this.goToDescription(stationId);
    } else {
      this.router.navigate(['stations', stationId]);
    }
  }

  trackByFn(index: number, marker: Marker): number {
    return marker.id;
  }

  recenterMap() {
    if (this.isViewSyncWithCurrentPosition) {
      if (this.isIOS) {
        this.requestPermissionsIOS.emit();
      } else {
        let isAlreadyCompassView = null;
        this.store.pipe(select(getIsCompassView, take(1))).subscribe((isCompassView) => isAlreadyCompassView = isCompassView);
        let currentBearing = null;
        this.store.pipe(select(getCurrentBearing, take(1))).subscribe((cb) => currentBearing = cb);
        if (currentBearing && !isAlreadyCompassView) {
          this.isCompassUncertain = false;
        }
        notifyCompassView(isAlreadyCompassView, currentBearing, this.snackBar);

        this.store.dispatch(toggleCompassView());
      }
    } else {
      let position: Coordinate;
      this.currentPosition$.pipe(take(1)).subscribe((cp) => {
        position = cp;
      });
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
        this.router.navigate(['itinerary', 'departure']);
        break;
      }

      case 1: {
        this.router.navigate(['itinerary', 'arrival']);
        break;
      }
    }
  }

  isFlatMap(latLng: LatLngBoundsLiteral): boolean {
    return latLng.north === latLng.south && latLng.east === latLng.west;
  }

  showTopBar(routeName: string): boolean {
    return ([
      'ItineraryMap',
    ].includes(routeName));
  }

  onBack(): void {
    let itineraryType: ItineraryType;
    this.itineraryType$.pipe(take(1))
      .subscribe((mode) => {
        itineraryType = mode;
      });

    if (itineraryType) {
      this.router.navigate(['itinerary', itineraryType]);
    }
  }

  goToDescription(stationId?: number): void {
    const destination: Station = this.getDestination();

    let itineraryType: ItineraryType;
    this.itineraryType$.pipe(take(1))
      .subscribe((mode) => {
        itineraryType = mode;
      });

    this.router.navigate(['itinerary', itineraryType, destination.stationId, 'description', stationId || destination.stationId]);
  }

  goToAbout(): void {
    const destination: Station = this.getDestination();

    let itineraryType: ItineraryType;
    this.itineraryType$.pipe(take(1))
      .subscribe((mode) => {
        itineraryType = mode;
      });

    if (destination) {
      this.router.navigate(['itinerary', itineraryType, destination.stationId, 'about']);
    } else {
      this.router.navigate(['about']);
    }
  }

  isMapCenterEqualCurrentPosition(): boolean {
    let position: Coordinate;
    this.currentPosition$.pipe(take(1)).subscribe((cp) => {
      position = cp;
    });
    let zoom: number;
    this.zoom$.pipe(take(1)).subscribe((z) => {
      zoom = z;
    });
    let mapCenter: Coordinate;
    this.mapCenter$.pipe(take(1)).subscribe((mc) => {
      mapCenter = mc;
    });
    return isEqual(mapCenter, DEFAULT_COORD) || isEqual(mapCenter, position) && zoom === DEFAULT_ZOOM;
  }

  private getDestination(): Station {
    let destination: Station;
    this.destination$.pipe(take(1))
      .subscribe((d) => {
        destination = d;
      });
    return destination;
  }
}
