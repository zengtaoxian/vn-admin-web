import 'babel-polyfill'
import Vue from 'vue'
import iView from 'iview';
import App from './App'
import router from './router'
import stores from './store/index'
import ElementUI from 'element-ui'
import 'iview/dist/styles/iview.css';
import 'element-ui/lib/theme-chalk/index.css'
import 'common/less/index.less'

Vue.use(iView);
Vue.use(ElementUI)

require('./mock.js');

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store:stores,
  render: h => h(App)
})
