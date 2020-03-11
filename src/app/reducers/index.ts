import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromStationsMap from './stations-map';
import * as fromStationsList from './stations-list';
import * as fromPosition from './position';
import * as fromScreen from './screen';

export interface AppState {
  stationsMap: fromStationsMap.StationState;
  stationsList: fromStationsList.StationState;
  position: fromPosition.PositionState;
  screen: fromScreen.ScreenState;
}

export const reducers: ActionReducerMap<AppState> = {
  stationsMap: fromStationsMap.reducer,
  stationsList: fromStationsList.reducer,
  position: fromPosition.reducer,
  screen: fromScreen.reducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
