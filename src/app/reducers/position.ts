import { Action, createReducer, on, createSelector } from '@ngrx/store';
import { AppState } from '.';
import { setPosition } from '../actions/position';

export interface PositionState {
  lat: number;
  lng: number;
}

const initialState: PositionState = {
  lat: null,
  lng: null,
};

export const positionReducer = createReducer(initialState,
  on(setPosition, (state, { lat, lng }) => {
    return {
      ...state,
      lat,
      lng,
    };
  }),
);

export function reducer(state: PositionState | undefined, action: Action) {
  return positionReducer(state, action);
}

export const selectPosition = (state: AppState) => state.position;
export const currentPosition = createSelector(selectPosition, (state: PositionState) => (
  state.lat && state.lng ? {
    lng: state.lng,
    lat: state.lat,
  } : null)
);
