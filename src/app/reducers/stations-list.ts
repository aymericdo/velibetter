import { Action, createReducer, createSelector, on } from '@ngrx/store';
import { AppState } from '.';
import { fetchingClosestStations, fetchingDestination, setDestination, setStationsList, unsetDestination } from '../actions/stations-list';
import { Station } from '../interfaces';

export type ItineraryType = 'departure' | 'arrival';

export interface StationState {
  list: Station[];
  isLoading: boolean;
  destination: Station;
  currentDelta: number;
  itineraryType: ItineraryType;
}

const initialState: StationState = {
  list: [],
  isLoading: true,
  destination: null,
  currentDelta: null,
  itineraryType: null,
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
      itineraryType: null,
    };
  }),
  on(fetchingDestination, (state, { itineraryType }) => {
    return {
      ...state,
      itineraryType,
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
export const getItineraryType = createSelector(
  selectStationsListState,
  (state: StationState) => state.itineraryType,
);
export const getCurrentDelta = createSelector(
  selectStationsListState,
  (state: StationState) => state.currentDelta,
);
