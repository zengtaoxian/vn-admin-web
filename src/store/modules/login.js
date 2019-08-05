import { login, logout, getInfo } from '@/api/login'
import Cookies from 'js-cookie'

// consts
const LOGIN_TOKEN = 'LOGIN_TOKEN'
const LOGIN_NAME = 'LOGIN_NAME'
const LOGIN_ROLES = 'LOGIN_ROLES'

// states
const state = {
  token: Cookies.get(LOGIN_TOKEN),
  name: '',
  roles: []
}

// getters
const getters = {
  token: state => state.token,
  name: state => state.name,
  roles: state => state.roles
}

// mutations
const mutations = {
  LOGIN_TOKEN: (state, token) => {
    state.token = token
  },
  LOGIN_NAME: (state, name) => {
    state.name = name
  },
  LOGIN_ROLES: (state, roles) => {
    state.roles = roles
  }
}

// actions
const actions = {
  // 登录
  Login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const data = response.data
        Cookies.set(LOGIN_TOKEN, data.userId)
        commit(LOGIN_TOKEN, data.userId)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  GetInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo({ userId: state.token }).then(response => {
        const data = response.data
        if (data.roleList && data.roleList.length > 0) {
          // 验证返回的roleList是否是一个非空数组
          commit(LOGIN_ROLES, data.roleList)
        } else {
          reject('getInfo: roleList must be a non-null array!')
        }
        commit(LOGIN_NAME, data.userName)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 登出
  LogOut({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit(LOGIN_TOKEN, '')
        commit(LOGIN_ROLES, [])
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
