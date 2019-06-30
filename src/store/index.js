import Vue from 'vue'
import Vuex from 'vuex'
import sidebar from './modules/sidebar'
import login from './modules/login'
import client from './modules/client'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    sidebar,
    login,
    client
  }
})

export default store
