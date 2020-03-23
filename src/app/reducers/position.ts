import { Action, createReducer, on, createSelector } from '@ngrx/store';
import { AppState } from '.';
import { setPosition, setDegrees, toggleCompassView } from '../actions/position';
import { Coordinate } from '../interfaces';

export interface PositionState {
  lat: number;
  lng: number;
  deg: number;
  isCompassView: boolean;
}

const initialState: PositionState = {
  lat: null,
  lng: null,
  deg: 0,
  isCompassView: false,
};

export const positionReducer = createReducer(initialState,
  on(setPosition, (state, { lat, lng }) => {
    return {
      ...state,
      lat,
      lng,
    };
  }),
  on(setDegrees, (state, { deg }) => {
    return {
      ...state,
      deg,
    };
  }),
  on(toggleCompassView, (state) => {
    return {
      ...state,
      isCompassView: !state.isCompassView,
    };
  }),
);

export function reducer(state: PositionState | undefined, action: Action) {
  return positionReducer(state, action);
}

export const selectPosition = (state: AppState) => state.position;
export const getCurrentPosition = createSelector(selectPosition, (state: PositionState) => (
  state.lat && state.lng ? {
    lng: state.lng,
    lat: state.lat,
  } as Coordinate : null)
);
export const getDegrees = createSelector(selectPosition, (state: PositionState) => state.deg);
export const getIsCompassView = createSelector(selectPosition, (state: PositionState) => state.isCompassView);
