import { Action, createReducer, on, createSelector } from '@ngrx/store';
import { AppState } from '.';
import { setRouteName, setUrl, setIsFullMap } from '../actions/route';

export interface RouteState {
  routeName: string;
  url: string;
  precedentUrl: string;
  isFullMap: boolean;
}

const initialState: RouteState = {
  routeName: '',
  url: null,
  precedentUrl: null,
  isFullMap: false,
};

export const screenReducer = createReducer(initialState,
  on(setRouteName, (state, { routeName }) => {
    return {
      ...state,
      routeName,
    };
  }),
  on(setUrl, (state, { url }) => {
    return {
      ...state,
      precedentUrl: state.url,
      url,
    };
  }),
  on(setIsFullMap, (state, { isFullMap }) => {
    return {
      ...state,
      isFullMap,
    };
  }),
);

export function reducer(state: RouteState | undefined, action: Action) {
  return screenReducer(state, action);
}

export const selectRoute = (state: AppState) => state.route;
export const getRouteName = createSelector(selectRoute, (state: RouteState) => state.routeName);
export const getPrecedentUrl = createSelector(selectRoute, (state: RouteState) => state.precedentUrl);
export const getIsSplitScreen = createSelector(selectRoute, (state: RouteState) => state.isFullMap);
