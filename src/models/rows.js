import * as rowsService from '../services/rows';

export default {

  namespace: 'rows',

  state: {
    rows: [],
    rowsMeta: {},
    haveMember: false
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    haveMember(state, action) {
      return { ...state, ...action.payload };
    }
  },


  effects: {
    *getRowsList({ payload }, { call, put }) {
      const { data } = yield call(rowsService.getRows, payload);
      const rows = data.public.rows.data;
      const rowsMeta = data.public.rows.meta;
      yield put({ type: 'save', payload: { rows, rowsMeta }});
    },
    *getMembers({ payload }, { call, put }) {
      const { data } = yield call(rowsService.haveMember, payload);
      const haveMember = data.me.haveMember;
      yield put({ type: 'save', payload: { haveMember }});
    },
    *createRow({payload}, {call, put}) {
      const {data} = yield call(rowsService.addRow, payload);
      const _payload = {
        id: payload.argv.tid
      };
      yield put({type: "getRowsList", payload: _payload});
    },
    *updateRow({payload}, {call, put}) {
      const {data} = yield call(rowsService.updateRow, payload);
      const _payload = {
        id: payload.argv.tid
      };
      yield put({type: "getRowsList", payload: _payload});
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({pathname, query}) => {
        if(pathname === '/') {
          // dispatch({ type: 'fetchVerifyCode'})
        }
      })
    }
  },
};
