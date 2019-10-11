import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import guid from './common.js'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000, // 请求超时时
  params: {
    rid : guid()
  }
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.state.login.token) {
      //让每个请求携带自定义token 请根据实际情况自行修改
      config.headers['Authorization'] = 'JWT ' + store.state.login.token
    }
    config.headers['Content-Type'] = 'application/json;charset=utf-8'

    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    return response
  },
  error => {
      if (error.response.status === 401) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('login/FedLogOut').then(() => {
            //为了重新实例化vue-router对象 避免bug
            location.reload()
          })
        })
      }

      return Promise.reject(error.response)
  }
)

export default service
