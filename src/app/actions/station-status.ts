import { createAction, props } from "@ngrx/store";
import { StationStatus } from "../services/api.service";

export const fetchingClosestStationsStatus = createAction(
  "[Stations] fetching closest stations status",
  props<{ lat: number; lng: number }>()
);

export const fetchingStationStatus = createAction(
  "[Stations] fetching stations status",
  props<{ stationId: number }>()
);

export const setStationsStatus = createAction(
  "[Stations] set stations status",
  props<{ list: StationStatus[] }>()
);

export const fetchingDestination = createAction(
  '[Stations] fetching destination',
  props<{ stationId: number }>(),
);

export const setDirection = createAction(
  '[Stations] set direction',
  props<{ direction: StationStatus }>(),
);
