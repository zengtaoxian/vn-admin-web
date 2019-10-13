import {login, logout} from '@/api/login'
import Cookies from 'js-cookie'

//consts
const LOGIN_TOKEN = 'LOGIN_TOKEN';
const LOGIN_USERNAME = 'LOGIN_USERNAME';
const LOGIN_UID = 'LOGIN_UID';

//states
const state = {
  token: Cookies.get(LOGIN_TOKEN) || '',
  username: Cookies.get(LOGIN_USERNAME) || '',
  uid: Cookies.get(LOGIN_UID) || ''
};

//getters
const getters = {
  token: state => state.token,
  username: state => state.username,
  uid: state => state.uid
};

//mutations
const mutations = {
  LOGIN_TOKEN: (state, token) => {
    state.token = token
  },
  LOGIN_USERNAME: (state, username) => {
    state.username = username
  },
  LOGIN_UID: (state, uid) => {
    state.uid = uid
  }
};

//actions
const actions = {
  //登录
  Login({commit}, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const data = response.data;
        Cookies.set(LOGIN_TOKEN, data.token);
        Cookies.set(LOGIN_USERNAME, userInfo.username);
        Cookies.set(LOGIN_UID, data.user.uid);
        commit(LOGIN_TOKEN, data.token);
        commit(LOGIN_USERNAME, userInfo.username);
        commit(LOGIN_UID, data.user.uid);
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  //登出
  LogOut({commit, state}) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit(LOGIN_TOKEN, '');
        commit(LOGIN_UID, '');
        Cookies.remove(LOGIN_TOKEN);
        Cookies.remove(LOGIN_USERNAME);
        Cookies.remove(LOGIN_UID);
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 前端登出
  FedLogOut({commit}) {
    return new Promise(resolve => {
      commit(LOGIN_TOKEN, '');
      commit(LOGIN_UID, '');
      Cookies.remove(LOGIN_TOKEN);
      Cookies.remove(LOGIN_USERNAME);
      Cookies.remove(LOGIN_UID);
      resolve()
    })
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
