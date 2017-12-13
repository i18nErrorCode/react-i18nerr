import * as tablesService from '../services/tables';
export default {

  namespace: 'tables',

  state: {
    tables: [],
    tablesMeta: {},
    showModal: false
  },

  reducers: {
    save(state, action) {
      console.log("reducer save==>", action)
      return { ...state, ...action.payload };
    },
  },


  effects: {
    *getTableList({ payload }, { call, put }) {
      const { data } = yield call(tablesService.getTables, payload);
      console.log("getTableList payload", payload)
      const tables = data.public.tables.data;
      const tablesMeta = data.public.tables.meta;
      yield put({ type: 'save', payload: { tables, tablesMeta }});
    },
    *createTable({ payload }, { call, put }) {
      const { data } = yield call(tablesService.createTable, payload);
      const _uid = localStorage.getItem("uid");
      const _keyJson = {uid: _uid};
      const query = {
        limit: 50,
        keyJson: JSON.stringify(_keyJson)
      };
      yield put({ type: "getTableList", payload:{query}});
    },
    *changeMember({ payload }, { call, put }) {
      const {data} = yield call(tablesService.changeMember, payload);
      console.log("改变成员: ", data)
      const _uid = localStorage.getItem("uid");
      const _keyJson = {uid: _uid};
      const query = {
        limit: 50,
        keyJson: JSON.stringify(_keyJson)
      };
      yield put({ type: "getTableList", payload:{query}});
    },
    showModal(state, action) {
      console.log("effects showModal==>", action)
      return { ...state, ...action.payload };
    },
  }
};
