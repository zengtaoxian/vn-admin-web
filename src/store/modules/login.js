import {
  signin,
  signout
} from '@/api/api';
import * as types from "@/store/types";

//consts
const LOGIN_INFO = 'LOGIN_INFO';
const LOGIN_NAME = 'LOGIN_NAME';

//states
const state = {
  token : '',
  roleId : '',
  userName: ''
};

//getters
const getters = {
  token: state => state.token,
  roleId: state => state.roleId,
  userName: state => state.userName
};

//actions
const actions = {
  login: ({commit}, data) => new Promise((reslove, reject) => {
    commit(LOGIN_NAME, data.email);
    signin(data).then(response => {
      if (response.data.respCode == '0') {
        let login_str = JSON.stringify(response.data.map);
        commit(LOGIN_INFO, login_str);
        window.localStorage.setItem('TOKEN', login_str);
      }
      reslove(response);
    }).catch(err => {
      reject(err);
    });
  }),

  logout: ({commit}) => new Promise((resolve, reject) => {
    signout().then(response => {
      commit(LOGIN_INFO, "{}");
      window.localStorage.setItem('TOKEN', "{}");
      resolve(response);
    }).catch(err => {
      reject(err);
    });
  }),

  load: ({commit}, data) => {
    commit(LOGIN_INFO, data);
    commit(LOGIN_NAME, window.localStorage.getItem('USER'));
  }
};

//mutations
const mutations = {
  [LOGIN_INFO](state, login_str) {
    let login_obj = JSON.parse(login_str);
    state.token = login_obj.token;
    state.roleId = login_obj.roleId;
  },

  [LOGIN_NAME](state, data) {
    state.userName = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
