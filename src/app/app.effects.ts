import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { createAction, select, Store } from '@ngrx/store';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, debounceTime, filter, map, mergeMap, take, withLatestFrom } from 'rxjs/operators';
import { savingFeedback } from './actions/feedback';
import { setBearing, setPosition } from './actions/galileo';
import { fetchingClosestStations, fetchingDestination, setDestination, setStationsList } from './actions/stations-list';
import { fetchingStationsInPolygon, selectingStation, selectStation, setStationsMap } from './actions/stations-map';
import { Coordinate, Station } from './interfaces';
import { AppState } from './reducers';
import { getFeedback } from './reducers/feedback';
import { getCurrentPosition, getPrecedentPosition } from './reducers/galileo';
import { getStationsStatusById } from './reducers/stations-list';
import { getStationsMapById, getZoom } from './reducers/stations-map';
import { ApiService } from './services/api.service';
import { bearing, getDistanceFromLatLonInKm } from './shared/helper';

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
      debounceTime(500),
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
      mergeMap(([{ isDeparture, delta }, position]) =>
        isDeparture ?
          this.apiService.fetchClosestStatusForDeparture(position as Coordinate, delta).pipe(
            map((stations: Array<Station>) =>
              setStationsList({ list: stations })
            ),
            catchError(() => EMPTY)
          )
        :
          this.apiService.fetchClosestStatusForArrival(position as Coordinate, delta).pipe(
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

  setPosition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setPosition),
      withLatestFrom(this.store.pipe(select(getPrecedentPosition))),
      mergeMap(([{ lat, lng }, precedentPosition]) => {
        if (!precedentPosition) {
          return of(setBearing({ bearing: null }));
        } else if (getDistanceFromLatLonInKm(lat, lng, precedentPosition.lat, precedentPosition.lng) > 0.01) {
          return of(setBearing({
            bearing: bearing(lat, lng, precedentPosition.lat, precedentPosition.lng),
          }));
        } else {
          return of(createAction('[TOO CLOSE TO CHANGE THE BEARING]')());
        }
      }),
    )
  );

  saveFeedback$ = createEffect(() =>
    this.actions$.pipe(
      ofType(savingFeedback),
      withLatestFrom(this.store.pipe(select(getFeedback), filter(Boolean))),
      mergeMap(([{ feedback }]) => {
        return this.apiService.saveFeedback(feedback).pipe(
          catchError(() => EMPTY)
        );
      }),
    )
  );
}
