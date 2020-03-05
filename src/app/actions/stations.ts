import { createAction, props } from "@ngrx/store";
import { StationInfo, StationStatus } from "../services/api.service";
import { LatLngBoundsLiteral } from "@agm/core";

export const fetchingClosestStationsInfo = createAction(
  "[Stations] fetching closest stations info",
  props<{ latLngBoundsLiteral: LatLngBoundsLiteral }>()
);
export const fetchingAllStationsInfo = createAction(
  "[Stations] fetching all stations info"
);
export const fetchingClosestStationsStatus = createAction(
  "[Stations] fetching closest stations status",
  props<{ stationIds: number[] }>()
);
export const setStationsInfo = createAction(
  "[Stations] set stations info",
  props<{ list: StationInfo[] }>()
);
export const setStationsStatus = createAction(
  "[Stations] set stations status",
  props<{ list: StationStatus[] }>()
);
