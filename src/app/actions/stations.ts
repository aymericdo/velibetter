import { createAction, props } from "@ngrx/store";
import { Station } from "../services/api.service";
import { LatLngBoundsLiteral } from "@agm/core";

export const fetchingClosestStations = createAction(
  "[Stations] fetching closest stations",
  props<{ latLngBoundsLiteral: LatLngBoundsLiteral }>()
);
export const fetchingAllStations = createAction(
  "[Stations] fetching all stations"
);
export const setStations = createAction(
  "[Stations] set stations",
  props<{ list: Station[] }>()
);
