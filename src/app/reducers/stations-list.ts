import { Action, createReducer, on, createSelector } from '@ngrx/store';
import { Station } from '../interfaces';
import { AppState } from '.';
import {
  fetchingClosestStations,
  setStationsList,
  setDestination
} from '../actions/stations-list';

export interface StationState {
  list: Station[];
  isLoading: boolean;
  destination: Station;
}

const initialState: StationState = {
  list: [],
  isLoading: false,
  destination: null,
};

export const stationsReducer = createReducer(
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
);

export function reducer(state: StationState | undefined, action: Action) {
  return stationsReducer(state, action);
}

export const selectStationsListState = (state: AppState) => state.stationsList;
export const isLoading = createSelector(
  selectStationsListState,
  (state: StationState) => state.isLoading,
);
export const stationsStatus = createSelector(
  selectStationsListState,
  (state: StationState) => state.list,
);
export const stationsStatusById = (id: number) => createSelector(
  selectStationsListState,
  (state: StationState) => state.list.find(status => status.stationId === id),
);
export const destination = createSelector(
  selectStationsListState,
  (state: StationState) => state.destination,
);
