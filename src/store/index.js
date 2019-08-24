import Vue from 'vue'
import Vuex from 'vuex'
import sidebar from './modules/sidebar'
import login from './modules/login'
import client from './modules/client'
import user from './modules/user'
import number from './modules/number'
import rate from './modules/rate'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    sidebar,
    login,
    client,
    user,
    number,
    rate
  }
})

export default store
