import { createAction, props } from '@ngrx/store';
import { Station } from '../services/api.service';

export const fetchingStations = createAction('[Stations] fetching stations');
export const setStations = createAction(
  '[Stations] set stations',
  props<{ list: Station[] }>(),
);
