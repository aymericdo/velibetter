import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromStation from './station-info';
import * as fromStationStatus from './station-status';
import * as fromPosition from './position';
import * as fromScreen from './screen';

export interface AppState {
  Station: fromStation.StationState;
  stationStatus: fromStationStatus.StationState;
  position: fromPosition.PositionState;
  screen: fromScreen.ScreenState;
}

export const reducers: ActionReducerMap<AppState> = {
  Station: fromStation.reducer,
  stationStatus: fromStationStatus.reducer,
  position: fromPosition.reducer,
  screen: fromScreen.reducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
