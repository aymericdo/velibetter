import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromStations from './stations';

export interface AppState {
  stations: fromStations.StationState;
}

export const reducers: ActionReducerMap<AppState> = {
  stations: fromStations.reducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
