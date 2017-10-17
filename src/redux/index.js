import { combineReducers } from 'redux';
import configureStore from './createStore';

// reducers
import userReducer from './user';

function createStore() {
  const rootReducer = combineReducers({
    USER: userReducer,
  });

  return configureStore(rootReducer);
}

// 返回一个store，供全局使用
export default createStore();
