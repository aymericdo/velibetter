import { createAction, props } from '@ngrx/store';
import { Station } from '../interfaces';
import { LatLngBoundsLiteral } from '@agm/core/services/google-maps-types';

export const initialFetchingStationsInPolygon = createAction(
  '[Stations Map] initial fetching stations in a polygon',
  props<{ latLngBoundsLiteral: LatLngBoundsLiteral }>()
);

export const fetchingStationsInPolygon = createAction(
  '[Stations Map] fetching stations in a polygon',
  props<{ latLngBoundsLiteral: LatLngBoundsLiteral }>()
);

export const setStationsMap = createAction(
  '[Stations Map] set stations map',
  props<{ list: Station[] }>()
);

export const selectingStation = createAction(
  '[Stations Map] select station',
  props<{ stationId: number }>(),
);

export const unselectStationMap = createAction(
  '[Stations Map] unselect station',
);

export const selectStation = createAction(
  '[Stations Map] set station map',
  props<{ station: Station }>()
);

export const setMapCenter = createAction(
  '[Stations Map] set map center',
  props<{ lat: number, lng: number }>(),
);

export const setZoom = createAction(
  '[Stations Map] set zoom',
  props<{ zoom: number }>(),
);