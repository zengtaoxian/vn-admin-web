import Vue from 'vue'
import Vuex from 'vuex'
import sidebar from './modules/sidebar'
import login from './modules/login'
import client from './modules/client'
import user from './modules/user'
import number from './modules/number'
import rate from './modules/rate'
import ring from './modules/ring'
import finance from './modules/finance'
import report from './modules/report'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    sidebar,
    login,
    client,
    user,
    number,
    rate,
    ring,
    finance,
    report
  }
})

export default store
