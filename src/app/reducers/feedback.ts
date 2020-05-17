import { Action, createReducer, createSelector, on } from '@ngrx/store';
import { setFeedback } from '../actions/feedback';
import { Feedback } from '../interfaces/index';
import { AppState } from './index';

export interface FeedbackState {
  feedback: Feedback;
}

const initialState: FeedbackState = {
  feedback: null
};

export const feedbackReducer = createReducer(
  initialState,
  on(setFeedback, (state, { feedback }) => {
    return {
      ...state,
      feedback
    };
  }),
);

export function reducer(state: FeedbackState | undefined, action: Action) {
  return feedbackReducer(state, action);
}

export const selectFeedback = (state: AppState) => state.feedback;
export const getFeedback = createSelector(selectFeedback, (state: FeedbackState) => state.feedback);
