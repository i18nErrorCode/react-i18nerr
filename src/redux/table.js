import { createAction, handleActions } from 'redux-actions';

export const STORE = 'STORE_TABLE';
export const INITIAL_STATE = [];

export const store = createAction(STORE, any => any);

const reducer = handleActions(
  {
    [STORE]: function(state, { payload }) {
      return payload;
    }
  },
  INITIAL_STATE
);

export default reducer;
