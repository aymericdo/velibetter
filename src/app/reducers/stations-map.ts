import { Action, createReducer, on, createSelector } from '@ngrx/store';
import {
  setStationsMap,
  fetchingStationsInPolygon,
  selectStation,
  selectingStation,
  unselectStationMap,
  resetZoom,
} from '../actions/stations-map';
import { Station, Coordinate } from '../interfaces';
import { AppState } from '.';
import { LatLngBoundsLiteral } from '@agm/core/services/google-maps-types';
import { setMapCenter, setZoom } from '../actions/stations-map';
import { DEFAULT_ZOOM } from '../shared/constants';

export interface StationState {
  list: Station[];
  isLoading: boolean;
  latLngBoundsLiteral: LatLngBoundsLiteral;
  mapCenter: Coordinate;
  zoom: number;
  selectedStation: Station;
  isSelectingStation: boolean;
  isFirstFetchDone: boolean;
}

const initialState: StationState = {
  list: [],
  isLoading: false,
  latLngBoundsLiteral: null,
  mapCenter: null,
  zoom: DEFAULT_ZOOM,
  selectedStation: null,
  isSelectingStation: false,
  isFirstFetchDone: false,
};

export const stationsMapReducer = createReducer(
  initialState,
  on(fetchingStationsInPolygon, (state, { latLngBoundsLiteral }) => {
    return {
      ...state,
      latLngBoundsLiteral,
      isLoading: !state.isFirstFetchDone,
      isFirstFetchDone: true,
    };
  }),
  on(setStationsMap, (state, { list }) => {
    return {
      ...state,
      list: list.map(s => {
        const station = state.list.find(currentStation => currentStation.stationId === s.stationId);
        return station ? station : s;
      }),
      isLoading: false
    };
  }),
  on(selectingStation, (state, { stationId }) => {
    return {
      ...state,
      selectedStation: state.list.find(s => s.stationId === stationId),
      isSelectingStation: true,
    };
  }),
  on(unselectStationMap, (state) => {
    return {
      ...state,
      selectedStation: null,
    };
  }),
  on(selectStation, (state, { station }) => {
    return {
      ...state,
      list: [
        ...state.list.filter(s => s.stationId !== station.stationId),
        station,
      ],
      selectedStation: { ...station },
      isSelectingStation: false,
    };
  }),
  on(setMapCenter, (state, { lat, lng }) => {
    return {
      ...state,
      mapCenter: {
        lat,
        lng,
      },
    };
  }),
  on(setZoom, (state, { zoom }) => {
    return {
      ...state,
      zoom,
    };
  }),
  on(resetZoom, (state) => {
    return {
      ...state,
      zoom: DEFAULT_ZOOM,
    };
  }),
);

export function reducer(state: StationState | undefined, action: Action) {
  return stationsMapReducer(state, action);
}

export const selectStationsMapState = (state: AppState) => state.stationsMap;
export const getIsLoading = createSelector(
  selectStationsMapState,
  (state: StationState) => state.isLoading,
);
export const getStationsMap = createSelector(
  selectStationsMapState,
  (state: StationState) => state.list,
);
export const getSelectedStation = createSelector(
  selectStationsMapState,
  (state: StationState) => state.selectedStation,
);
export const getLatLngBoundsLiteral = createSelector(
  selectStationsMapState,
  (state: StationState) => state.latLngBoundsLiteral,
);
export const getStationsMapById = (id: number) => createSelector(
  selectStationsMapState,
  (state: StationState) => state.list.find(s => s.stationId === id),
);
export const getIsSelectingStation = createSelector(
  selectStationsMapState,
  (state: StationState) => state.isSelectingStation,
);
export const getMarkers = createSelector(selectStationsMapState, (state: StationState) =>
  state.list.map(s => ({
    id: s.stationId,
    lat: s.lat,
    lng: s.lng,
  })),
);
export const getMapCenter = createSelector(
  selectStationsMapState,
  (state: StationState) => state.mapCenter,
);
export const getZoom = createSelector(
  selectStationsMapState,
  (state: StationState) => state.zoom,
);
