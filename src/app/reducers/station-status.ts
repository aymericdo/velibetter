import { Action, createReducer, on, createSelector } from '@ngrx/store';
import { StationStatus } from '../services/api.service';
import { AppState } from '.';
import {
  fetchingClosestStationsStatus,
  setStationsStatus
} from '../actions/station-status';

export interface StationState {
  list: StationStatus[];
  isLoading: boolean;
}

const initialState: StationState = {
  list: [],
  isLoading: false
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
      list: list.concat(list),
      isLoading: false,
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
