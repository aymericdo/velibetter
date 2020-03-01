import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { fetchingStations, setStations } from './actions/stations';
import { ApiService, Station } from './services/api.service';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
  ) { }

  fetchingStations$ = createEffect(() => this.actions$.pipe(
    ofType(fetchingStations),
    mergeMap(() => this.apiService.fetch()
      .pipe(
        map((stations: Array<Station>) => setStations({ list: stations })),
        catchError(() => EMPTY),
      )),
  ));
}
