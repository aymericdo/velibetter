import { Action, createReducer, on, createSelector } from '@ngrx/store';
import { Station } from '../interfaces';
import { AppState } from '.';
import {
  fetchingClosestStations,
  setStationsList,
  setDestination,
  unsetDestination
} from '../actions/stations-list';

export interface StationState {
  list: Station[];
  isLoading: boolean;
  destination: Station;
}

const initialState: StationState = {
  list: [],
  isLoading: true,
  destination: null,
};

export const stationsListReducer = createReducer(
  initialState,
  on(fetchingClosestStations, state => {
    return {
      ...state,
      isLoading: true,
    };
  }),
  on(setStationsList, (state, { list }) => {
    return {
      ...state,
      list,
      isLoading: false,
    };
  }),
  on(setDestination, (state, { destination }) => {
    return {
      ...state,
      destination,
    };
  }),
  on(unsetDestination, state => {
    return {
      ...state,
      destination: null,
    };
  }),
);

export function reducer(state: StationState | undefined, action: Action) {
  return stationsListReducer(state, action);
}

export const selectStationsListState = (state: AppState) => state.stationsList;
export const getIsLoading = createSelector(
  selectStationsListState,
  (state: StationState) => state.isLoading,
);
export const getStationsStatus = createSelector(
  selectStationsListState,
  (state: StationState) => state.list,
);
export const getStationsStatusById = (id: number) => createSelector(
  selectStationsListState,
  (state: StationState) => state.list.find(status => status.stationId === id),
);
export const getDestination = createSelector(
  selectStationsListState,
  (state: StationState) => state.destination,
);
