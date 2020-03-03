import { Action, createReducer, on, createSelector } from "@ngrx/store";
import {
  fetchingAllStations,
  setStations,
  fetchingClosestStations
} from "../actions/stations";
import { Station } from "../services/api.service";
import { AppState } from ".";

export interface Marker {
  lat: number;
  lng: number;
  alpha: number;
}

export interface StationState {
  list: Station[];
  isLoading: boolean;
}

const initialState: StationState = {
  list: [],
  isLoading: false
};

export const stationsReducer = createReducer(
  initialState,
  on(fetchingAllStations, state => {
    return {
      ...state,
      isLoading: true
    };
  }),
  on(fetchingClosestStations, state => {
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
    lat: s.lat,
    lng: s.lon,
    alpha: 0.4
  }))
);
