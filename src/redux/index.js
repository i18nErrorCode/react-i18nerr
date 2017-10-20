import { combineReducers } from 'redux';
import configureStore from './createStore';

// reducers
import userReducer from './user';
import infoReducer from './info';
import tableReducer from './table';
import rowFormReducer from './rowForm';
import tableFormReducer from './tableForm';

function createStore() {
  const rootReducer = combineReducers({
    USER: userReducer,
    INFO: infoReducer,
    TABLE: tableReducer,
    ROW_FORM: rowFormReducer,
    TABLE_FORM: tableFormReducer,
  });

  return configureStore(rootReducer);
}

// 返回一个store，供全局使用
export default createStore();
