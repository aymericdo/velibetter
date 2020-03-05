import { Action, createReducer, on, createSelector } from "@ngrx/store";
import {
  fetchingAllStationsInfo,
  setStations,
  fetchingClosestStationsInfo
} from "../actions/stations";
import { StationInfo } from "../services/api.service";
import { AppState } from ".";

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
  on(setStations, (state, { list }) => {
    return {
      ...state,
      list,
      isLoading: false
    };
  })
);

export function reducer(state: StationState | undefined, action: Action) {
  return stationsReducer(state, action);
}

export const selectStations = (state: AppState) => state.stations;
export const isLoading = createSelector(
  selectStations,
  (state: StationState) => state.isLoading
);
export const stations = createSelector(
  selectStations,
  (state: StationState) => state.list
);
export const markers = createSelector(selectStations, (state: StationState) =>
  state.list.map(s => ({
    id: s.stationId,
    lat: s.lat,
    lng: s.lng,
    alpha: 0.4
  }))
);
