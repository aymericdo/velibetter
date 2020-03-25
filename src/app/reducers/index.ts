import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromStationsMap from './stations-map';
import * as fromStationsList from './stations-list';
import * as fromGalileo from './galileo';
import * as fromScreen from './screen';

export interface AppState {
  stationsMap: fromStationsMap.StationState;
  stationsList: fromStationsList.StationState;
  galileo: fromGalileo.GalileoState;
  screen: fromScreen.ScreenState;
}

export const reducers: ActionReducerMap<AppState> = {
  stationsMap: fromStationsMap.reducer,
  stationsList: fromStationsList.reducer,
  galileo: fromGalileo.reducer,
  screen: fromScreen.reducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
