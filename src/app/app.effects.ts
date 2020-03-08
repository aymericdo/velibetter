import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, concatMap, withLatestFrom, tap, switchMap } from 'rxjs/operators';
import {
  fetchingAllStationsInfo,
  setStationsInfo,
  fetchingClosestStationsInfo,
  setStationsStatus
} from './actions/stations';
import { ApiService, StationInfo, StationStatus } from './services/api.service';
import {
  fetchingClosestStationsStatus,
} from './actions/stations';
import { Store, select } from '@ngrx/store';
import { AppState } from './reducers';
import { currentPosition } from './reducers/position';

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
}
