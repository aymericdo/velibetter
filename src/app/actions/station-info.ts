import { createAction, props } from '@ngrx/store';
import { StationInfo } from '../services/api.service';
import { LatLngBoundsLiteral } from '@agm/core';

export const fetchingClosestStationsInfo = createAction(
  '[Stations] fetching closest stations info',
  props<{ latLngBoundsLiteral: LatLngBoundsLiteral }>()
);

export const fetchingAllStationsInfo = createAction(
  '[Stations] fetching all stations info'
);

export const setStationsInfo = createAction(
  '[Stations] set stations info',
  props<{ list: StationInfo[] }>()
);
