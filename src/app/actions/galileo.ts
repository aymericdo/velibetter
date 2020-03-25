import { createAction, props } from '@ngrx/store';

export const setPosition = createAction(
  '[Position] set position',
  props<{ lat: number, lng: number }>(),
);

export const setDegrees = createAction(
  '[Position] set degrees',
  props<{ deg: number }>(),
);

export const toggleCompassView = createAction(
  '[Position] toggle compass view',
);
