import { Action, createReducer, on, createSelector } from '@ngrx/store';
import {
  setStationsMap,
  fetchingStationsInPolygon,
  selectStation,
  selectingStation,
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
      list: list.map(s => {
        const station = state.list.find(currentStation => currentStation.stationId === s.stationId);
        if (station) {
          return station;
        } else {
          return s;
        }
      }),
      isLoading: false
    };
  }),
  on(selectingStation, (state, { stationId }) => {
    return {
      ...state,
      isSelectingStation: true,
    };
  }),
  on(unselectStationMap, (state) => {
    return {
      ...state,
      selectedStation: null,
    };
  }),
  on(selectStation, (state, { station }) => {
    return {
      ...state,
      list: [
        ...state.list.filter(s => s.stationId !== station.stationId),
        station,
      ],
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
export const stationsMapById = (id: number) => createSelector(
  selectStationsMapState,
  (state: StationState) => state.list.find(s => s.stationId === id),
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
