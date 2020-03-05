import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { EMPTY } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import {
  fetchingAllStationsInfo,
  setStationsInfo,
  fetchingClosestStationsInfo
} from "./actions/stations";
import { ApiService, StationInfo, StationStatus } from "./services/api.service";
import {
  fetchingClosestStationsStatus,
  setStationsStatus
} from "./actions/stations";

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions, private apiService: ApiService) {}

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
      mergeMap(({ stationIds }) =>
        this.apiService.fetchClosestStatus(stationIds).pipe(
          map((stations: Array<StationStatus>) =>
            setStationsStatus({ list: stations })
          ),
          catchError(() => EMPTY)
        )
      )
    )
  );
}
