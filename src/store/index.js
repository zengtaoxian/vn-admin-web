import Vue from 'vue'
import Vuex from 'vuex'
import sidebar from './modules/sidebar'
import login from './modules/login'
import client from './modules/client'
import user from './modules/system/user'
import number from './modules/number'
import rate from './modules/rate'
import ring from './modules/ring'
import finance from './modules/finance'
import report from './modules/report'
import service_type from "./modules/system/service_type"
import role from "./modules/system/role"
import menu from "./modules/system/menu"

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
    report,
    service_type,
    role,
    menu
  }
})

export default store
