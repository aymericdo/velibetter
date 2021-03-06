import { createAction, props } from '@ngrx/store';
import { Station } from '../interfaces';
import { Coordinate } from '../interfaces/index';
import { ItineraryType } from '../reducers/stations-list';

export const fetchingClosestStations = createAction(
  '[Stations List] fetching closest stations status',
  props<{ isDeparture: boolean, delta?: number }>()
);

export const setStationsList = createAction(
  '[Stations List] set stations status',
  props<{ list: Station[] }>()
);

export const fetchingDestination = createAction(
  '[Stations List] fetching destination',
  props<{ itineraryType: ItineraryType, stationId: number }>(),
);

export const unsetDestination = createAction(
  '[Stations List] unset destination',
);

export const setDestination = createAction(
  '[Stations List] set destination',
  props<{ currentPosition: Coordinate, destination: Station }>(),
);
