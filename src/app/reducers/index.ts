import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromStations from './stations';
import * as fromPosition from './position';
import * as fromScreen from './screen';

export interface AppState {
  stations: fromStations.StationState;
  position: fromPosition.PositionState;
  screen: fromScreen.PositionState;
}

export const reducers: ActionReducerMap<AppState> = {
  stations: fromStations.reducer,
  position: fromPosition.reducer,
  screen: fromScreen.reducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
