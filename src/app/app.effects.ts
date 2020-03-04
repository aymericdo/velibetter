import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import {
  fetchingAllStations,
  setStations,
  fetchingClosestStations
} from './actions/stations';
import { ApiService, Station } from './services/api.service';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions, private apiService: ApiService) {}

  fetchingClosestStations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchingClosestStations),
      mergeMap(({ latLngBoundsLiteral }) =>
        this.apiService.fetchClosest(latLngBoundsLiteral).pipe(
          map((stations: Array<Station>) => setStations({ list: stations })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  fetchingAllStations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchingAllStations),
      mergeMap(() =>
        this.apiService.fetchAll().pipe(
          map((stations: Array<Station>) => setStations({ list: stations })),
          catchError(() => EMPTY)
        )
      )
    )
  );
}
