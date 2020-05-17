import { createAction, props } from '@ngrx/store';
import { Feedback } from '../interfaces';

export const savingFeedback = createAction(
  '[Feedback] saving feedback',
  props<{ feedback: Feedback }>()
);

export const setFeedback = createAction(
  '[Feedback] set feedback',
  props<{ feedback: Feedback }>()
);
