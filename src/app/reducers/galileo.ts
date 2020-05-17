import { Action, createReducer, createSelector, on } from '@ngrx/store';
import { AppState } from '.';
import { setBearing, setDegrees, setIsNoGeolocation, setPosition, toggleCompassView } from '../actions/galileo';
import { Coordinate } from '../interfaces';

export interface GalileoState {
  currentPos: Coordinate;
  precedentPos: Coordinate;
  deg: number;
  isCompassView: boolean;
  isNoGeolocation: boolean;
  bearing: number;
}

const initialState: GalileoState = {
  currentPos: null,
  precedentPos: null,
  deg: null,
  isCompassView: false,
  isNoGeolocation: false,
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
      isNoGeolocation: false,
    };
  }),
  on(setIsNoGeolocation, (state, { isNoGeolocation }) => {
    return {
      ...state,
      isNoGeolocation,
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
export const getIsNoGeolocation = createSelector(selectPosition, (state: GalileoState) => state.isNoGeolocation);
export const getIsCompassView = createSelector(selectPosition, (state: GalileoState) => state.isCompassView);
export const getHasBearingOrDeg = createSelector(selectPosition, (state: GalileoState) => state.bearing !== null && state.deg !== null);
export const getCurrentBearing = createSelector(selectPosition, (state: GalileoState) =>
  state.isCompassView && state.bearing !== null && state.deg !== null ?
    (state.bearing + state.deg) % 360
    :
    null
);
