import { notification } from 'antd';
import { routerRedux } from 'dva/router';

import * as loginService from '../services/user';

export default {

  namespace: 'user',

  state: {
    userInfo: {}
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *onLogin({ payload }, { call, put }) {
      const data = yield call(loginService.login, payload);
      if (data.errors) {
        console.log("登录失败" + data.errors[0].message)
      } else {
        localStorage.setItem("token", data.data.public.login.token);
        localStorage.setItem("uid", data.data.public.login.uid);
        localStorage.setItem("username", data.data.public.login.username);
        const userInfo = data.data.public.login;
        notification['success']({
          message: '登录成功',
          description: '........',
          duration: 1,
        });
        yield  put(routerRedux.push({pathname: '/'}));
        yield put({ type: 'save', payload:userInfo });
      }
    },
    *onRegister({ payload }, { call, put }) {
      const data = yield call(loginService.register, payload);
      if (data.errors) {
        console.log("注册失败" + data.errors[0].message)
      } else {
        notification['success']({
          message: '注册成功',
          description: '........',
          duration: 1,
        });
        yield  put(routerRedux.push({pathname: '/login'}));
        // yield put({ type: 'save', payload:userInfo });
      }
    },
    *onLogout() {
      yield  put(routerRedux.push({pathname: '/login'}));
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },

  },

};
