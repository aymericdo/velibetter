import { createAction, props } from '@ngrx/store';
import { Station } from '../services/api.service';

export const fetchingClosestStationsStatus = createAction(
  '[Stations] fetching closest stations status',
  props<{ isDeparture: boolean }>()
);

export const fetchingStationStatus = createAction(
  '[Stations] fetching stations status',
  props<{ stationId: number }>()
);

export const setStationsStatus = createAction(
  '[Stations] set stations status',
  props<{ list: Station[] }>()
);

export const fetchingDestination = createAction(
  '[Stations] fetching destination',
  props<{ stationId: number }>(),
);

export const setDirection = createAction(
  '[Stations] set direction',
  props<{ direction: Station }>(),
);
