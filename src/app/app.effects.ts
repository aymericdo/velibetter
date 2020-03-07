import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import {
  fetchingAllStationsInfo,
  setStations,
  fetchingClosestStationsInfo
} from './actions/stations';
import { ApiService, StationInfo } from './services/api.service';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions, private apiService: ApiService) {}

  fetchingClosestStationsInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchingClosestStationsInfo),
      mergeMap(({ latLngBoundsLiteral }) =>
        this.apiService.fetchClosestInfo(latLngBoundsLiteral).pipe(
          map((stations: Array<StationInfo>) =>
            setStations({ list: stations })
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
            setStations({ list: stations })
          ),
          catchError(() => EMPTY)
        )
      )
    )
  );
}
