import {
  fetch_menu_info,
  fetch_perm_info
} from '@/api/api';
import * as types from "@/store/types";

//states
const state = {
  menu_info: {},
  perm_info: [],
  header_title: '',
  msg_numb: 0
};

//getters
const getters = {
  menu_info: state => state.menu_info,
  perm_info: state => state.perm_info,
  check_perm: (state) => (id) => {
    if (id) {
      return state.perm_info.indexOf(id.toString()) !== -1;
    } else {
      return true;
    }
  },
  header_title: (state) => {
    return state.header_title
  },
  msg_numb: (state) => {
    return state.msg_numb
  }
};

//actions
const actions = {
  get_menu_info: ({commit}, data) => new Promise((reslove, reject) => {
    fetch_menu_info(data).then(response => {
      if (response.data.respCode == '0') {
        let data_str = JSON.stringify(response.data.map);
        commit(types.MENU_INFO, data_str);
      }
      reslove(response);
    }).catch(err => {
      reject(err);
    });
  }),

  get_perm_info: ({commit}, data) => new Promise((resolve, reject) => {
    fetch_perm_info(data).then(response => {
      if (response.data.respCode == '0') {
        let data_str = JSON.stringify(response.data.map);
        commit(types.PERM_INFO, data_str);
      }
      resolve(response);
    }).catch(err => {
      reject(err);
    });
  }),
  header_title: (({commit}, title) => {
    commit(types.HEADER_TITLE, title)
  })
};

//mutations
const mutations = {
  [types.MENU_INFO](state, data_str) {

    let data_obj = JSON.parse(data_str);
    state.menu_info = data_obj;
  },

  [types.PERM_INFO](state, data_str) {

    let data_obj = JSON.parse(data_str);

    state.perm_info = data_obj.data;
    // state.msg_numb = data_obj.notReadMessage;
  },

  [types.HEADER_TITLE](state, title) {
    state.header_title = title;
  }

};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
