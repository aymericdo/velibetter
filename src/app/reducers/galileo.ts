import { Action, createReducer, on, createSelector } from '@ngrx/store';
import { AppState } from '.';
import { setPosition, setDegrees, toggleCompassView } from '../actions/galileo';
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

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

// Converts from degrees to radians.
function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

// Converts from radians to degrees.
function toDegrees(radians: number): number {
  return radians * 180 / Math.PI;
}

function bearing(startLat: number, startLng: number, destLat: number, destLng: number): number {
  startLat = toRadians(startLat);
  startLng = toRadians(startLng);
  destLat = toRadians(destLat);
  destLng = toRadians(destLng);

  const y = Math.sin(destLng - startLng) * Math.cos(destLat);
  const x = Math.cos(startLat) * Math.sin(destLat) -
    Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  let brng = Math.atan2(y, x);
  brng = toDegrees(brng);
  return (brng + 360) % 360;
}

export const positionReducer = createReducer(initialState,
  on(setPosition, (state, { lat, lng }) => {
    return {
      ...state,
      precedentPos: {
        ...state.currentPos,
      },
      bearing: state.currentPos && getDistanceFromLatLonInKm(state.currentPos.lat, state.currentPos.lng, lat, lng) > 0.01 ?
        bearing(
          state.currentPos.lat,
          state.currentPos.lng,
          lat,
          lng,
        ) : null,
      currentPos: {
        lat,
        lng,
      },
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
