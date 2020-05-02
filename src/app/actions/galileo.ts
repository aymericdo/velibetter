import { createAction, props } from '@ngrx/store';

export const setPosition = createAction(
  '[galileo] set position',
  props<{ lat: number, lng: number }>(),
);

export const setIsNoGeolocation = createAction(
  '[galileo] set is no geolocation',
  props<{ isNoGeolocation: boolean }>(),
);

export const setDegrees = createAction(
  '[galileo] set degrees',
  props<{ deg: number }>(),
);

export const toggleCompassView = createAction(
  '[galileo] toggle compass view',
);

export const setBearing = createAction(
  '[galileo] set bearing',
  props<{ bearing: number }>(),
);
