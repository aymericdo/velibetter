import { Action, createReducer, on, createSelector } from '@ngrx/store';
import { AppState } from '.';
import { setPosition, setDegrees, toggleCompassView, setBearing } from '../actions/galileo';
import { Coordinate } from '../interfaces';

export interface GalileoState {
  currentPos: Coordinate;
  precedentPos: Coordinate;
  deg: number;
  isCompassView: boolean;
  bearing: number;
}

const initialState: GalileoState = {
  currentPos: null,
  precedentPos: null,
  deg: null,
  isCompassView: false,
  bearing: null,
};

export const positionReducer = createReducer(initialState,
  on(setPosition, (state, { lat, lng }) => {
    return {
      ...state,
      currentPos: {
        lat,
        lng,
      },
    };
  }),
  on(setBearing, (state, { bearing }) => {
    return {
      ...state,
      precedentPos: {
        ...state.currentPos,
      },
      bearing,
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

export function reducer(state: GalileoState | undefined, action: Action) {
  return positionReducer(state, action);
}

export const selectPosition = (state: AppState) => state.galileo;
export const getCurrentPosition = createSelector(selectPosition, (state: GalileoState) => state.currentPos);
export const getPrecedentPosition = createSelector(selectPosition, (state: GalileoState) => state.precedentPos);
export const getDegrees = createSelector(selectPosition, (state: GalileoState) => state.deg);
export const getIsCompassView = createSelector(selectPosition, (state: GalileoState) => state.isCompassView);
export const getCurrentBearing = createSelector(selectPosition, (state: GalileoState) =>
  state.isCompassView && state.bearing !== null && state.deg !== null ?
    (state.bearing + state.deg) % 360
  :
    null
);
