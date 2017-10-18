import { combineReducers } from 'redux';
import configureStore from './createStore';

// reducers
import userReducer from './user';
import infoReducer from './info';
import tableReducer from './table';

function createStore() {
  const rootReducer = combineReducers({
    USER: userReducer,
    INFO: infoReducer,
    TABLE: tableReducer,
  });

  return configureStore(rootReducer);
}

// 返回一个store，供全局使用
export default createStore();
