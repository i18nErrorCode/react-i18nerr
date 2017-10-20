/**
 * 存储table输入框的值
 */
import { createAction, handleActions } from 'redux-actions';

export const STORE = 'STORE_TABLE_FORM';
export const INITIAL_STATE = {};

export const tableFormStore = createAction(STORE, any => any);

const reducer = handleActions(
  {
    [STORE]: function(state, { payload }) {
      return payload;
    }
  },
  INITIAL_STATE
);

export default reducer;
