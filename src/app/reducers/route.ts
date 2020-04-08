import { Action, createReducer, on, createSelector } from '@ngrx/store';
import { AppState } from '.';
import { setRouteName } from '../actions/route';

export interface RouteState {
  routeName: string;
}

const initialState: RouteState = {
  routeName: '',
};

export const screenReducer = createReducer(initialState,
  on(setRouteName, (state, { routeName }) => {
    return {
      ...state,
      routeName,
    };
  }),
);

export function reducer(state: RouteState | undefined, action: Action) {
  return screenReducer(state, action);
}

export const selectRoute = (state: AppState) => state.route;
export const getRouteName = createSelector(selectRoute, (state: RouteState) => state.routeName);
