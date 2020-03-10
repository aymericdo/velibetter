import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, take } from 'rxjs/operators';
import {
  setStationsStatus, fetchingDestination, setDirection,
} from './actions/station-status';
import {
  fetchingAllStationsInfo,
  setStationsInfo,
  fetchingClosestStationsInfo,
} from './actions/station-info';
import { ApiService, StationInfo, StationStatus } from './services/api.service';
import {
  fetchingClosestStationsStatus,
} from './actions/station-status';
import { Store, select } from '@ngrx/store';
import { AppState } from './reducers';
import { currentPosition } from './reducers/position';
import { stationsStatusById } from './reducers/station-status';

@Injectable()
export class AppEffects {
  currentPosition$: Observable<{ lat: number; lng: number }>;

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private apiService: ApiService,
  ) {
    this.currentPosition$ = store.pipe(select(currentPosition));
  }

  fetchingClosestStationsInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchingClosestStationsInfo),
      mergeMap(({ latLngBoundsLiteral }) =>
        this.apiService.fetchClosestInfo(latLngBoundsLiteral).pipe(
          map((stations: Array<StationInfo>) =>
            setStationsInfo({ list: stations })
          ),
          catchError(() => EMPTY)
        )
      )
    )
  );

  fetchingAllStationsInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchingAllStationsInfo),
      mergeMap(() =>
        this.apiService.fetchAllInfo().pipe(
          map((stations: Array<StationInfo>) =>
            setStationsInfo({ list: stations })
          ),
          catchError(() => EMPTY)
        )
      )
    )
  );

  fetchingClosestStationsStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchingClosestStationsStatus),
      mergeMap(({ lat, lng }) =>
        this.apiService.fetchClosestStatusForDeparture(lat, lng).pipe(
          map((stations: Array<StationStatus>) =>
            setStationsStatus({ list: stations })
          ),
          catchError(() => EMPTY)
        )
      )
    )
  );

  fetchingDestination$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchingDestination),
      mergeMap(({ stationId }) => {
        let direction = null;
        this.store.pipe(
          select(stationsStatusById(stationId)),
          take(1),
        ).subscribe(d => direction = d);

        if (direction) {
          return of(setDirection({ direction }));
        } else {
          return this.apiService.fetchStationStatus(stationId).pipe(
            map((station: StationStatus) =>
              setDirection({ direction: station })
            ),
            catchError(() => EMPTY)
          );
        }
      }),
    ),
  );
}
