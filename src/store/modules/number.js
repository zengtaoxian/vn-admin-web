import { addInfo, delInfo, mdfInfo, getInfo, getList } from '@/api/number'
import {DEF_PAGE_NUM_OPTS, DEF_PAGE_NUM_SELECT, DEF_PAGE_NO} from '@/utils/constant'

//consts
const PAGE_NUM_SELECT = 'PAGE_NUM_SELECT';
const PAGE_NO = 'PAGE_NO';
const PAGE_TOTAL = 'PAGE_TOTAL';
const DATA_LIST = 'DATA_LIST';

//states
const state = {
  pageNumOpts: DEF_PAGE_NUM_OPTS,
  pageNumSelect: DEF_PAGE_NUM_SELECT,
  pageNo: DEF_PAGE_NO,
  pageTotal: 0,
  dataList: []
};

//getters
const getters = {
  pageNumOpts: state => state.pageNumOpts,
  pageNumSelect: state => state.pageNumSelect,
  pageNo: state => state.pageNo,
  pageTotal: state => state.pageTotal,
  dataList: state => state.dataList
};

//actions
const actions = {
  //添加信息
  addInfo: ({commit}, reqData) => new Promise((reslove, reject) => {
    addInfo(reqData).then(response => {
      reslove(response);
    }).catch(err => {
      reject(err);
    });
  }),

  //删除信息
  delInfo: ({commit}, reqData) => new Promise((reslove, reject) => {
    let data = [
      reqData.id
    ];
    delInfo(data).then(response => {
      reslove(response);
    }).catch(err => {
      reject(err);
    });
  }),

  //修改信息
  mdfInfo: ({commit}, reqData) => new Promise((reslove, reject) => {
    mdfInfo(reqData).then(response => {
      reslove(response);
    }).catch(err => {
      reject(err);
    });
  }),

  //获取信息
  getInfo: ({commit}, reqData) => new Promise((resolve, reject) => {
    let data = {
      id: reqData.id,
    };
    getInfo(data).then(response => {
      if (response.code === 0) {
        let respData = response.data;
        if (response.code === 0) {
          resolve(respData);
        } else {
          reject(respData);
        }
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
      if (response.code === 0) {
        commit(PAGE_NO, 'page' in reqData ? reqData.page : DEF_PAGE_NO)
        commit(PAGE_NUM_SELECT, 'limit' in reqData ? reqData.limit : DEF_PAGE_NUM_SELECT)
        commit(DATA_LIST, response.data.list)
        commit(PAGE_TOTAL, response.data.totalCount)
      }
      reslove(response);
    }).catch(err => {
      reject(err);
    });
  })
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
