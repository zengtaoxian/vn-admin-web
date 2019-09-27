import { login, logout } from '@/api/login'
import Cookies from 'js-cookie'

//consts
const LOGIN_TOKEN = 'LOGIN_TOKEN'
const LOGIN_NAME = 'LOGIN_NAME'
const LOGIN_UID = 'LOGIN_UID'

//states
const state = {
  token: Cookies.get(LOGIN_TOKEN),
  name: '',
  uid: ''
}

//getters
const getters = {
  token: state => state.token,
  name: state => state.name,
  uid: state => state.uid
}

//mutations
const mutations = {
  LOGIN_TOKEN: (state, token) => {
    state.token = token
  },
  LOGIN_NAME: (state, name) => {
    state.name = name
  },
  LOGIN_UID: (state, uid) => {
    state.uid = uid
  }
}

//actions
const actions = {
  //登录
  Login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const data = response.data
        Cookies.set(LOGIN_TOKEN, data.token)
        commit(LOGIN_TOKEN, data.token)
        commit(LOGIN_NAME, userInfo.name)
        commit(LOGIN_UID, data.user.uid)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  //登出
  LogOut({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit(LOGIN_TOKEN, '')
        commit(LOGIN_NAME, '')
        commit(LOGIN_UID, '')
        Cookies.remove(LOGIN_TOKEN)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 前端登出
  FedLogOut({ commit }) {
    return new Promise(resolve => {
      commit(LOGIN_TOKEN, '')
      commit(LOGIN_UID, '')
      Cookies.remove(LOGIN_TOKEN)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
