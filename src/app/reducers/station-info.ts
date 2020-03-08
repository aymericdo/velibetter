import { Action, createReducer, on, createSelector } from '@ngrx/store';
import {
  fetchingAllStationsInfo,
  setStationsInfo,
  fetchingClosestStationsInfo
} from '../actions/station-info';
import { StationInfo } from '../services/api.service';
import { AppState } from '.';

export interface Marker {
  id: number;
  lat: number;
  lng: number;
  alpha: number;
}

export interface StationState {
  list: StationInfo[];
  isLoading: boolean;
}

const initialState: StationState = {
  list: [],
  isLoading: false
};

export const stationsReducer = createReducer(
  initialState,
  on(fetchingAllStationsInfo, state => {
    return {
      ...state,
      isLoading: true
    };
  }),
  on(fetchingClosestStationsInfo, state => {
    return {
      ...state,
      isLoading: true
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
export const markers = createSelector(selectStationInfo, (state: StationState) =>
  state.list.map(s => ({
    id: s.stationId,
    lat: s.lat,
    lng: s.lng,
    alpha: 0.4
  }))
);
