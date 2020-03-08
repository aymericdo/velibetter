import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromStationInfo from './station-info';
import * as fromStationStatus from './station-status';
import * as fromPosition from './position';
import * as fromScreen from './screen';

export interface AppState {
  stationInfo: fromStationInfo.StationState;
  stationStatus: fromStationStatus.StationState;
  position: fromPosition.PositionState;
  screen: fromScreen.ScreenState;
}

export const reducers: ActionReducerMap<AppState> = {
  stationInfo: fromStationInfo.reducer,
  stationStatus: fromStationStatus.reducer,
  position: fromPosition.reducer,
  screen: fromScreen.reducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
