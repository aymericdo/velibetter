import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, take, withLatestFrom, filter } from 'rxjs/operators';
import {
  setStationsList,
  fetchingDestination,
  setDestination,
} from './actions/stations-list';
import {
  setStationsMap,
  fetchingStationsInPolygon,
  selectingStation,
  selectStation,
} from './actions/stations-map';
import { ApiService } from './services/api.service';
import { fetchingClosestStations } from './actions/stations-list';
import { Store, select, createAction } from '@ngrx/store';
import { AppState } from './reducers';
import { getCurrentPosition } from './reducers/galileo';
import { getStationsStatusById } from './reducers/stations-list';
import { Coordinate, Station } from './interfaces';
import { getStationsMapById, getZoom } from './reducers/stations-map';

@Injectable()
export class AppEffects {
  currentPosition$: Observable<Coordinate>;

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private apiService: ApiService
  ) { }

  fetchingStationsInPolygon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchingStationsInPolygon),
      withLatestFrom(this.store.pipe(select(getCurrentPosition))),
      mergeMap(([{ latLngBoundsLiteral }, position]) => {
        // I don't understand how combineLatest could be useful in this case
        let currentZoom = null;
        this.store
          .pipe(select(getZoom), take(1))
          .subscribe(z => (currentZoom = z));

        if (currentZoom > 14) {
          return this.apiService.fetchClosestInfo(latLngBoundsLiteral, position as Coordinate).pipe(
            map((stations: Array<Station>) => setStationsMap({ list: stations })),
            catchError(() => EMPTY)
          );
        } else {
          return of(createAction('[ZOOM TOO LARGE]')());
        }
      })
    )
  );

  fetchingClosestStations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchingClosestStations),
      withLatestFrom(this.store.pipe(select(getCurrentPosition), filter(Boolean))),
      mergeMap(([{ isDeparture }, position]) =>
        isDeparture ?
          this.apiService.fetchClosestStatusForDeparture(position as Coordinate).pipe(
            map((stations: Array<Station>) =>
              setStationsList({ list: stations })
            ),
            catchError(() => EMPTY)
          )
        :
          this.apiService.fetchClosestStatusForArrival(position as Coordinate).pipe(
            map((stations: Array<Station>) =>
              setStationsList({ list: stations })
            ),
            catchError(() => EMPTY)
          )
      )
    )
  );

  selectingStation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectingStation),
      withLatestFrom(this.store.pipe(select(getCurrentPosition))),
      mergeMap(([{ stationId }, position]) => {
        // I don't understand how combineLatest could be useful in this case
        let selectedStation = null;
        this.store
          .pipe(select(getStationsMapById(stationId)), take(1))
          .subscribe(s => (selectedStation = s));

        if (selectedStation && selectedStation.distance) {
          return of(selectStation({ station: selectedStation }));
        } else {
          return this.apiService.fetchStation(stationId, position as Coordinate).pipe(
            map((station: Station) =>
              selectStation({ station })
            ),
            catchError(() => EMPTY)
          );
        }
      })
    )
 );

  fetchingDestination$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchingDestination),
      withLatestFrom(this.store.pipe(select(getCurrentPosition), filter(Boolean))),
      mergeMap(([{ stationId }, position]) => {
        // I don't understand how combineLatest could be useful in this case
        let destination = null;
        this.store
          .pipe(select(getStationsStatusById(stationId)), take(1))
          .subscribe(d => (destination = d));

        if (destination) {
          return of(setDestination({ destination }));
        } else {
          return this.apiService.fetchStation(stationId, position as Coordinate).pipe(
            map((station: Station) =>
              setDestination({ destination: station })
            ),
            catchError(() => EMPTY)
          );
        }
      })
    )
  );
}
