import { addInfo, delInfo, mdfInfo, getInfo, resetInfo, getList } from '@/api/client'
import {DEF_PAGE_NUM_OPTS, DEF_PAGE_NUM_SELECT, DEF_PAGE_NO} from '@/utils/constant'

//consts
const PAGE_NUM_SELECT = 'PAGE_NUM_SELECT';
const PAGE_NO = 'PAGE_NO';
const PAGE_TOTAL = 'PAGE_TOTAL';
const DATA_INFO = 'DATA_INFO';
const DATA_LIST = 'DATA_LIST';

//states
const state = {
  pageNumOpts: DEF_PAGE_NUM_OPTS,
  pageNumSelect: DEF_PAGE_NUM_SELECT,
  pageNo: DEF_PAGE_NO,
  pageTotal: 0,
  dataList: [],
  dataInfo: {
    uid: '',
    name: '',
    email: '',
    mobile: '',
    status: '',
    balance: '',
    overdraft: '',
    create_user: '',
    create_time: '',
    update_time: ''
  }
};

//getters
const getters = {
  pageNumOpts: state => state.pageNumOpts,
  pageNumSelect: state => state.pageNumSelect,
  pageNo: state => state.pageNo,
  pageTotal: state => state.pageTotal,
  dataInfo: state => state.dataInfo,
  dataList: state => state.dataList
};

//actions
const actions = {
  //添加信息
  addInfo: ({commit}) => new Promise((reslove, reject) => {
    addInfo(state.dataInfo).then(response => {
      reslove(response);
    }).catch(err => {
      reject(err);
    });
  }),

  //删除信息
  delInfo: ({commit}, reqData) => new Promise((reslove, reject) => {
    let data = [
      reqData.uid
    ];
    delInfo(data).then(response => {
      reslove(response);
    }).catch(err => {
      reject(err);
    });
  }),

  //修改信息
  mdfInfo: ({commit}) => new Promise((reslove, reject) => {
    mdfInfo(state.dataInfo).then(response => {
      reslove(response);
    }).catch(err => {
      reject(err);
    });
  }),

  //获取信息
  getInfo: ({commit}, reqData) => new Promise((resolve, reject) => {
    let data = {
      uid: reqData.uid,
    };
    getInfo(data).then(response => {
      if (response.status === 200) {
        let respData = {}
        if (response.data.results.length > 0) {
          respData = response.data.results[0]
          commit(DATA_INFO, JSON.parse(JSON.stringify(respData)));
        }
        resolve(respData);
      } else {
        reject(response);
      }
    }).catch(err => {
      reject(err);
    });
  }),

  //获取列表
  getList: ({commit}, reqData) => new Promise((reslove, reject) => {
    getList(reqData).then(response => {
      if (response.status === 200) {
        commit(PAGE_NO, 'page' in reqData ? reqData.page : DEF_PAGE_NO)
        commit(PAGE_NUM_SELECT, 'limit' in reqData ? reqData.limit : DEF_PAGE_NUM_SELECT)
        commit(DATA_LIST, response.data.results)
        commit(PAGE_TOTAL, response.data.count)
      }
      reslove(response);
    }).catch(err => {
      reject(err);
    });
  }),

  //重置信息
  resetInfo: ({commit}, reqData) => new Promise((reslove, reject) => {
    let data = {
      uid: reqData.uid,
    };
    resetInfo(data).then(response => {
      reslove(response);
    }).catch(err => {
      reject(err);
    });
  }),

  //清空信息
  clearInfo: ({commit}) => new Promise((reslove, reject) => {
    let dataInfo = {
      uid: '',
      name: '',
      email: '',
      mobile: '',
      status: '',
      balance: '',
      overdraft: '',
      create_user: '',
      create_time: '',
      update_time: ''
    };
    commit(DATA_INFO, dataInfo);
    reslove();
  }),
};

//mutations
const mutations = {
  [PAGE_NUM_SELECT](state, data) {
    state.pageNumSelect = data;
  },

  [PAGE_NO](state, data) {
    state.pageNo = data;
  },

  [PAGE_TOTAL](state, data) {
    state.pageTotal = data;
  },

  [DATA_INFO](state, data) {
    state.dataInfo = data;
  },

  [DATA_LIST](state, data) {
    state.dataList = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
