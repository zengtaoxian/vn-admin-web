import Vue from 'vue'
import Vuex from 'vuex'
import  mutations from './mutations'
import state from './state'
import actions from './actions'
import getters from './getters'
import createLogger from 'vuex/dist/logger'

import login from './modules/login';
import main from './modules/main';
import system from './modules/system';



Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export  default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  modules: {
    login,
    main,
    system
  },
  plugins: debug ? [createLogger()] : []
})
