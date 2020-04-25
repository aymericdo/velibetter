import { Action, createReducer, on, createSelector } from '@ngrx/store';
import { Station } from '../interfaces';
import { AppState } from '.';
import {
  fetchingClosestStations,
  setStationsList,
  setDestination,
  unsetDestination,
  fetchingDestination
} from '../actions/stations-list';

export interface StationState {
  list: Station[];
  isLoading: boolean;
  destination: Station;
  currentDelta: number;
  travelMode: string;
}

const initialState: StationState = {
  list: [],
  isLoading: true,
  destination: null,
  currentDelta: null,
  travelMode: null,
};

export const stationsListReducer = createReducer(
  initialState,
  on(fetchingClosestStations, (state, { delta }) => {
    return {
      ...state,
      isLoading: true,
      currentDelta: delta
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
      travelMode: null,
    };
  }),
  on(fetchingDestination, (state, { travelMode }) => {
    return {
      ...state,
      travelMode,
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
export const getTravelMode = createSelector(
  selectStationsListState,
  (state: StationState) => state.travelMode,
);
export const getCurrentDelta = createSelector(
  selectStationsListState,
  (state: StationState) => state.currentDelta,
);
