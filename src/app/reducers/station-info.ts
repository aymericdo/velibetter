import { Action, createReducer, on, createSelector } from '@ngrx/store';
import {
  fetchingAllStationsInfo,
  setStationsInfo,
  fetchingClosestStationsInfo
} from '../actions/station-info';
import { StationInfo } from '../services/api.service';
import { AppState } from '.';
import { LatLngBoundsLiteral } from '@agm/core/services/google-maps-types';

export interface Marker {
  id: number;
  lat: number;
  lng: number;
}

export interface StationState {
  list: StationInfo[];
  isLoading: boolean;
  latLngBoundsLiteral: LatLngBoundsLiteral;
}

const initialState: StationState = {
  list: [],
  isLoading: false,
  latLngBoundsLiteral: null,
};

export const stationsReducer = createReducer(
  initialState,
  on(fetchingAllStationsInfo, state => {
    return {
      ...state,
      isLoading: true
    };
  }),
  on(fetchingClosestStationsInfo, (state, { latLngBoundsLiteral }) => {
    return {
      ...state,
      latLngBoundsLiteral,
      isLoading: true,
    };
  }),
  on(setStationsInfo, (state, { list }) => {
    return {
      ...state,
      list,
      isLoading: false
    };
  }),
);

export function reducer(state: StationState | undefined, action: Action) {
  return stationsReducer(state, action);
}

export const selectStationInfo = (state: AppState) => state.stationInfo;
export const isLoading = createSelector(
  selectStationInfo,
  (state: StationState) => state.isLoading
);
export const stationsInfo = createSelector(
  selectStationInfo,
  (state: StationState) => state.list
);
export const latLngBoundsLiteral = createSelector(
  selectStationInfo,
  (state: StationState) => state.latLngBoundsLiteral
);
export const markers = createSelector(selectStationInfo, (state: StationState) =>
  state.list.map(s => ({
    id: s.stationId,
    lat: s.lat,
    lng: s.lng,
  }))
);
