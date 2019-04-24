import 'babel-polyfill'
import Vue from 'vue'
import iView from 'iview';
import App from './App'
import router from './router'
import stores from './store/index'
import ElementUI from 'element-ui'
// import VueAreaLinkage from 'vue-area-linkage';
// import cookie from './utils/cookies'
// import http from './utils/http'
// import VeeValidate from './validate'
// import Loading from 'base/loading'



import 'iview/dist/styles/iview.css';
import 'element-ui/lib/theme-chalk/index.css'
import 'common/less/index.less'



Vue.use(iView);
Vue.use(ElementUI)
// Vue.use(VueAreaLinkage)

// import filters from './filters'
// Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))

//移动端300毫秒延长
// fastclick.attach(document.body)



// Vue.use(cookie)
// Vue.use(http)
// Vue.use(VeeValidate)
// Vue.use(Loading)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store:stores,
  render: h => h(App)
})
