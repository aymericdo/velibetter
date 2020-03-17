import { Action, createReducer, on, createSelector } from '@ngrx/store';
import { AppState } from '.';
import { setIsMobile } from '../actions/screen';

export interface ScreenState {
  isMobile: boolean;
}

const initialState: ScreenState = {
  isMobile: false,
};

export const screenReducer = createReducer(initialState,
  on(setIsMobile, (state, { isMobile }) => {
    return {
      ...state,
      isMobile,
    };
  }),
);

export function reducer(state: ScreenState | undefined, action: Action) {
  return screenReducer(state, action);
}

export const selectScreen = (state: AppState) => state.screen;
export const getIsMobile = createSelector(selectScreen, (state: ScreenState) => state.isMobile);
