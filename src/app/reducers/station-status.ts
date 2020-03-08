import { Action, createReducer, on, createSelector } from '@ngrx/store';
import { StationStatus } from '../services/api.service';
import { AppState } from '.';
import {
  fetchingClosestStationsStatus,
  setStationsStatus,
  setDirection
} from '../actions/station-status';

export interface StationState {
  list: StationStatus[];
  isLoading: boolean;
  direction: StationStatus;
}

const initialState: StationState = {
  list: [],
  isLoading: false,
  direction: null,
};

export const stationsReducer = createReducer(
  initialState,
  on(fetchingClosestStationsStatus, state => {
    return {
      ...state,
      isLoading: true,
    };
  }),
  on(setStationsStatus, (state, { list }) => {
    return {
      ...state,
      list,
      isLoading: false,
    };
  }),
  on(setDirection, (state, { direction }) => {
    return {
      ...state,
      direction,
    };
  }),
);

export function reducer(state: StationState | undefined, action: Action) {
  return stationsReducer(state, action);
}

export const selectStationStatus = (state: AppState) => state.stationStatus;
export const isLoading = createSelector(
  selectStationStatus,
  (state: StationState) => state.isLoading
);
export const stationsStatus = createSelector(
  selectStationStatus,
  (state: StationState) => state.list
);
export const stationsStatusById = (id: number) => createSelector(
  selectStationStatus,
  (state: StationState) => state.list.find(status => status.stationId === id)
);
export const direction = createSelector(
  selectStationStatus,
  (state: StationState) => state.direction
);
