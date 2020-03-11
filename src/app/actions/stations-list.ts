import { createAction, props } from '@ngrx/store';
import { Station } from '../interfaces';

export const fetchingClosestStations = createAction(
  '[Stations List] fetching closest stations status',
  props<{ isDeparture: boolean }>()
);

export const setStationsList = createAction(
  '[Stations List] set stations status',
  props<{ list: Station[] }>()
);

export const fetchingDestination = createAction(
  '[Stations List] fetching destination',
  props<{ stationId: number }>(),
);

export const setDestination = createAction(
  '[Stations List] set destination',
  props<{ destination: Station }>(),
);
