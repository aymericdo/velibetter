import { createAction, props } from '@ngrx/store';

export const setRouteName = createAction(
  '[Route] set route name',
  props<{ routeName: string }>(),
);
