import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromStationsMap from './stations-map';
import * as fromStationsList from './stations-list';
import * as fromGalileo from './galileo';
import * as fromScreen from './screen';
import * as fromRoute from './route';
import * as fromFeedback from './feedback';

export interface AppState {
  stationsMap: fromStationsMap.StationState;
  stationsList: fromStationsList.StationState;
  galileo: fromGalileo.GalileoState;
  route: fromRoute.RouteState;
  screen: fromScreen.ScreenState;
  feedback: fromFeedback.FeedbackState;
}

export const reducers: ActionReducerMap<AppState> = {
  stationsMap: fromStationsMap.reducer,
  stationsList: fromStationsList.reducer,
  galileo: fromGalileo.reducer,
  route: fromRoute.reducer,
  screen: fromScreen.reducer,
  feedback: fromFeedback.reducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
