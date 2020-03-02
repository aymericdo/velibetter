import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromStations from './stations';
import * as fromPosition from './position';

export interface AppState {
  stations: fromStations.StationState;
  position: fromPosition.PositionState;
}

export const reducers: ActionReducerMap<AppState> = {
  stations: fromStations.reducer,
  position: fromPosition.reducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
