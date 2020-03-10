import { createAction, props } from '@ngrx/store';
import { Station } from '../services/api.service';
import { LatLngBoundsLiteral } from '@agm/core/services/google-maps-types';

export const fetchingClosestStationsInfo = createAction(
  '[Stations] fetching closest stations info',
  props<{ latLngBoundsLiteral: LatLngBoundsLiteral }>()
);

export const setStationsInfo = createAction(
  '[Stations] set stations info',
  props<{ list: Station[] }>()
);
