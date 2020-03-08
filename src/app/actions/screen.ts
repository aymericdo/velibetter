import { createAction, props } from '@ngrx/store';

export const setIsMobile = createAction(
  '[Screen] set is mobile',
  props<{ isMobile: boolean }>(),
);
