import { Action, createReducer, on, createSelector } from "@ngrx/store";
import {
  fetchingAllStationsInfo,
  setStationsInfo,
  fetchingClosestStationsInfo
} from "../actions/stations";
import { StationInfo, StationStatus } from "../services/api.service";
import { AppState } from ".";
import {
  fetchingClosestStationsStatus,
  setStationsStatus
} from "../actions/stations";

export interface Marker {
  id: number;
  lat: number;
  lng: number;
  alpha: number;
}

export interface StationState {
  infoList: StationInfo[];
  statusList: StationStatus[];
  isLoading: boolean;
}

const initialState: StationState = {
  infoList: [],
  statusList: [],
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
  on(fetchingClosestStationsStatus, state => {
    return {
      ...state,
      isLoading: true
    };
  }),
  on(setStationsInfo, (state, { list }) => {
    return {
      ...state,
      infoList: list,
      isLoading: false
    };
  }),
  on(setStationsStatus, (state, { list }) => {
    return {
      ...state,
      statusList: list,
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
export const stationsInfo = createSelector(
  selectStations,
  (state: StationState) => state.infoList
);
export const stationsStatus = createSelector(
  selectStations,
  (state: StationState) => state.statusList
);
export const markers = createSelector(selectStations, (state: StationState) =>
  state.infoList.map(s => ({
    id: s.stationId,
    lat: s.lat,
    lng: s.lng,
    alpha: 0.4
  }))
);
