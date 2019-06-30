import { addInfo, delInfo, mdfInfo, getInfo, getList } from '@/api/client'

//consts
const PAGE_NUM_SELECT = 'PAGE_NUM_SELECT';
const PAGE_NO = 'PAGE_NO';
const PAGE_TOTAL = 'PAGE_TOTAL';
const DATA_INFO = 'DATA_INFO';
const DATA_LIST = 'DATA_LIST';

//states
const state = {
  pageNumOpts: [10, 20, 30, 40],
  pageNumSelect: 0,
  pageNo: 1,
  pageTotal: 10,
  dataList: [],
  dataInfo: {
    id: '',
    name: '',
    email: '',
    mobile: '',
    balance: '',
    overdraft: '',
    createUser: '',
    createTime: '',
    updateTime: ''
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
  delInfo: ({commit}, data) => new Promise((reslove, reject) => {
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
  getInfo: ({commit}) => new Promise((resolve, reject) => {
    let data = {
      id: state.dataInfo.id,
    };
    getInfo(data).then(response => {
      if (response.code === 0) {
        let data = response.data;
        if (response.code === 0) {
          commit(DATA_INFO, JSON.parse(JSON.stringify(data)));
          resolve(data);
        } else {
          reject(data);
        }
      } else {
        reject(response);
      }
    }).catch(err => {
      reject(err);
    });
  }),

  //获取列表
  getList: ({commit}, data) => new Promise((reslove, reject) => {
    getList(data).then(response => {
      if (response.code === 0) {
        let idx = state.pageNumOpts.indexOf(data.pageNum);
        if (-1 !== idx) {
          commit(PAGE_NO, data.pageNo);
          commit(PAGE_NUM_SELECT, idx);
          commit(DATA_LIST, response.data);
          commit(PAGE_TOTAL, response.total);
        }
      }
      reslove(response);
    }).catch(err => {
      reject(err);
    });
  }),

  //重置信息
  resetInfo: ({commit}) => new Promise((reslove, reject) => {
    let dataInfo = {
      id: '',
      name: '',
      email: '',
      mobile: '',
      balance: '',
      overdraft: '',
      createUser: '',
      createTime: '',
      updateTime: ''
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
