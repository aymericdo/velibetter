import { Component, OnDestroy, OnInit, EventEmitter } from "@angular/core";
import {
  fetchingAllStations,
  fetchingClosestStations
} from "./actions/stations";
import { Store, select } from "@ngrx/store";
import { AppState } from "./reducers";
import { isLoading, markers, Marker } from "./reducers/stations";
import { Observable } from "rxjs";
import { setPosition } from "./actions/position";
import { currentPosition } from "./reducers/position";
import { LatLngBounds } from "@agm/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {
  title = "Velibetter";
  markers$: Observable<Marker[]>;
  isLoading$: Observable<boolean>;
  currentPosition$: Observable<{ lat: number; lng: number }>;
  watcher: number = null;

  // Châtelet
  defaultCoord = { lat: 48.859889, lng: 2.346878 };
  zoom = 16;

  constructor(private store: Store<AppState>) {
    this.isLoading$ = store.pipe(select(isLoading));
    this.markers$ = store.pipe(select(markers));
    this.currentPosition$ = store.pipe(select(currentPosition));
  }

  ngOnInit() {
    this.watcher = navigator.geolocation.watchPosition(
      this.displayLocationInfo,
      this.handleLocationError,
      { timeout: 0 }
    );

    this.store.dispatch(fetchingAllStations());
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
  };

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
  };

  boundsChange(event: LatLngBounds) {
    console.log(event);
    // this.store.dispatch(
    //   fetchingClosestStations({ latLngBoundsLiteral: event.toJSON() })
    // );
  }
}
