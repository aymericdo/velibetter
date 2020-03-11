import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, take, withLatestFrom, filter } from 'rxjs/operators';
import {
  setStationsList,
  fetchingDestination,
  setDestination
} from './actions/stations-list';
import {
  setStationsMap,
  fetchingStationsInPolygon,
  selectStationMap,
  setStationMap,
} from './actions/stations-map';
import { ApiService } from './services/api.service';
import { fetchingClosestStations } from './actions/stations-list';
import { Store, select } from '@ngrx/store';
import { AppState } from './reducers';
import { currentPosition } from './reducers/position';
import { stationsStatusById } from './reducers/stations-list';
import { Coordinate, Station } from './interfaces';
import { selectedStation, stationsMap } from './reducers/stations-map';

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
      withLatestFrom(this.store.pipe(select(currentPosition))),
      mergeMap(([{ latLngBoundsLiteral }, position]) =>
        this.apiService.fetchClosestInfo(latLngBoundsLiteral, position as Coordinate).pipe(
          map((stations: Array<Station>) =>
            setStationsMap({ list: stations })
          ),
          catchError(() => EMPTY)
        )
      )
    )
  );

  fetchingClosestStations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchingClosestStations),
      withLatestFrom(this.store.pipe(select(currentPosition), filter(Boolean))),
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

  selectStationMap$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectStationMap),
      withLatestFrom(this.store.pipe(select(stationsMap))),
      map(([{ stationId }, list]) => list.find(s => s.stationId === stationId) as Station),
      filter((station) => !station.distance),
      withLatestFrom(this.store.pipe(select(currentPosition))),
      mergeMap(([{ stationId }, position]) =>
        this.apiService.fetchStation(stationId, position as Coordinate).pipe(
          map((station: Station) =>
            setStationMap({ station })
          ),
          catchError(() => EMPTY)
        ),
      ),
    )
  );

  fetchingDestination$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchingDestination),
      withLatestFrom(this.store.pipe(select(currentPosition), filter(Boolean))),
      mergeMap(([{ stationId }, position]) => {
        // I don't understand how combineLatest could be useful in this case
        let destination = null;
        this.store
          .pipe(select(stationsStatusById(stationId)), take(1))
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
