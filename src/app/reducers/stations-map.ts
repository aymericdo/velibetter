import { Action, createReducer, on, createSelector } from '@ngrx/store';
import {
  setStationsMap,
  fetchingStationsInPolygon,
  setStationMap,
  selectStation,
  unselectStationMap,
} from '../actions/stations-map';
import { Station } from '../interfaces';
import { AppState } from '.';
import { LatLngBoundsLiteral } from '@agm/core/services/google-maps-types';

export interface StationState {
  list: Station[];
  isLoading: boolean;
  latLngBoundsLiteral: LatLngBoundsLiteral;
  selectedStation: Station;
}

const initialState: StationState = {
  list: [],
  isLoading: false,
  latLngBoundsLiteral: null,
  selectedStation: null,
};

export const stationsReducer = createReducer(
  initialState,
  on(fetchingStationsInPolygon, (state, { latLngBoundsLiteral }) => {
    return {
      ...state,
      latLngBoundsLiteral,
      isLoading: true,
    };
  }),
  on(setStationsMap, (state, { list }) => {
    return {
      ...state,
      list,
      isLoading: false
    };
  }),
  on(selectStation, (state, { stationId }) => {
    return {
      ...state,
      selectedStation: state.list.find(s => s.stationId === stationId),
    };
  }),
  on(unselectStationMap, (state) => {
    return {
      ...state,
      selectedStation: null,
    };
  }),
  on(setStationMap, (state, { station }) => {
    return {
      ...state,
      list: [
        ...state.list.filter(s => s.stationId !== station.stationId),
        station,
      ],
      selectedStation: { ...station },
    };
  }),
);

export function reducer(state: StationState | undefined, action: Action) {
  return stationsReducer(state, action);
}

export const selectStationsMapState = (state: AppState) => state.stationsMap;
export const isLoading = createSelector(
  selectStationsMapState,
  (state: StationState) => state.isLoading
);
export const stationsMap = createSelector(
  selectStationsMapState,
  (state: StationState) => state.list
);
export const selectedStation = createSelector(
  selectStationsMapState,
  (state: StationState) => state.selectedStation
);
export const latLngBoundsLiteral = createSelector(
  selectStationsMapState,
  (state: StationState) => state.latLngBoundsLiteral
);
export const markers = createSelector(selectStationsMapState, (state: StationState) =>
  state.list.map(s => ({
    id: s.stationId,
    lat: s.lat,
    lng: s.lng,
  }))
);
