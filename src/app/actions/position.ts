import { createAction, props } from '@ngrx/store';

export const setPosition = createAction(
  '[Position] set position',
  props<{ lat: number, lng: number }>(),
);
