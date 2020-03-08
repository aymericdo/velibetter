import { createAction, props } from '@ngrx/store';
import { StationStatus } from '../services/api.service';

export const fetchingClosestStationsStatus = createAction(
  '[Stations] fetching closest stations status',
  props<{ lat: number, lng: number }>(),
);

export const setStationsStatus = createAction(
  '[Stations] set stations status',
  props<{ list: StationStatus[] }>()
);
