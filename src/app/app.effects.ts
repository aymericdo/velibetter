import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, take } from 'rxjs/operators';
import {
  setStationsStatus,
  fetchingDestination,
  setDirection
} from './actions/station-status';
import {
  setStationsInfo,
  fetchingClosestStationsInfo
} from './actions/station-info';
import { ApiService, Station } from './services/api.service';
import { fetchingClosestStationsStatus } from './actions/station-status';
import { Store, select } from '@ngrx/store';
import { AppState } from './reducers';
import { currentPosition } from './reducers/position';
import { stationsStatusById } from './reducers/station-status';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private apiService: ApiService
  ) {}

  fetchingClosestStationsInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchingClosestStationsInfo),
      mergeMap(({ latLngBoundsLiteral }) => {
        // temp because I don't understand how combineLatest works
        let position = null;
        this.store
            .pipe(select(currentPosition), take(1))
            .subscribe(p => (position = p));

        return this.apiService.fetchClosestInfo(latLngBoundsLiteral, position).pipe(
          map((stations: Array<Station>) =>
            setStationsInfo({ list: stations })
          ),
          catchError(() => EMPTY)
        );
      })
    )
  );

  fetchingClosestStationsStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchingClosestStationsStatus),
      mergeMap(({ isDeparture }) => {
        // temp because I don't understand how combineLatest works
        let position = null;
        this.store
            .pipe(select(currentPosition), take(1))
            .subscribe(p => (position = p));

        return (
          isDeparture ?
            this.apiService.fetchClosestStatusForDeparture(position).pipe(
              map((stations: Array<Station>) =>
                setStationsStatus({ list: stations })
              ),
              catchError(() => EMPTY)
            )
          :
            this.apiService.fetchClosestStatusForArrival(position).pipe(
              map((stations: Array<Station>) =>
                setStationsStatus({ list: stations })
              ),
              catchError(() => EMPTY)
            )
        );
      })
    )
  );

  fetchingDestination$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchingDestination),
      mergeMap(({ stationId }) => {
        // temp because I don't understand how combineLatest works
        let direction = null;
        this.store
          .pipe(select(stationsStatusById(stationId)), take(1))
          .subscribe(d => (direction = d));

        let position = null;
        this.store
            .pipe(select(currentPosition), take(1))
            .subscribe(p => (position = p));

        if (direction) {
          return of(setDirection({ direction }));
        } else {
          return this.apiService.fetchStation(stationId, position).pipe(
            map((station: Station) =>
              setDirection({ direction: station })
            ),
            catchError(() => EMPTY)
          );
        }
      })
    )
  );
}
