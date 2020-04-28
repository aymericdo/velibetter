import { createAction, props } from '@ngrx/store';

export const setRouteName = createAction(
  '[Route] set route name',
  props<{ routeName: string }>(),
);

export const setIsFullMap = createAction(
  '[Route] set is split screen',
  props<{ isFullMap: boolean }>(),
);

export const setUrl = createAction(
  '[Route] set url',
  props<{ url: string }>(),
);
