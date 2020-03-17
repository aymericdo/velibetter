import { Action, createReducer, on, createSelector } from '@ngrx/store';
import {
  setStationsMap,
  fetchingStationsInPolygon,
  setStationMap,
  selectStation,
  unselectStationMap,
  initialFetchingStationsInPolygon,
} from '../actions/stations-map';
import { Station } from '../interfaces';
import { AppState } from '.';
import { LatLngBoundsLiteral } from '@agm/core/services/google-maps-types';

export interface StationState {
  list: Station[];
  isLoading: boolean;
  latLngBoundsLiteral: LatLngBoundsLiteral;
  selectedStation: Station;
  isSelectingStation: boolean;
}

const initialState: StationState = {
  list: [],
  isLoading: false,
  latLngBoundsLiteral: null,
  selectedStation: null,
  isSelectingStation: false,
};

export const stationsMapReducer = createReducer(
  initialState,
  on(initialFetchingStationsInPolygon, (state, { latLngBoundsLiteral }) => {
    return {
      ...state,
      latLngBoundsLiteral,
      isLoading: true,
    };
  }),
  on(fetchingStationsInPolygon, (state, { latLngBoundsLiteral }) => {
    return {
      ...state,
      latLngBoundsLiteral,
      isLoading: false,
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
      isSelectingStation: true,
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
      selectedStation: { ...station },
      isSelectingStation: false,
    };
  }),
);

export function reducer(state: StationState | undefined, action: Action) {
  return stationsMapReducer(state, action);
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
export const isSelectingStation = createSelector(
  selectStationsMapState,
  (state: StationState) => state.isSelectingStation
);
export const markers = createSelector(selectStationsMapState, (state: StationState) =>
  state.list.map(s => ({
    id: s.stationId,
    lat: s.lat,
    lng: s.lng,
  }))
);
