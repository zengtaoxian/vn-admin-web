import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import guid from './common.js'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000, // 请求超时时
  withCredentials: true,
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
    /**
     * code为非0是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.code !== 0) {
      Message({
        message: res.msg + res.code,
        type: 'error',
        duration: 5 * 1000
      })

      // 50008:非法的token; 50012:其他客户端登录了;  10017:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 10017) {
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
      return Promise.reject(response.data)
    } else {
      return response.data
    }
  },
  error => {
    //for debug
    console.log('err' + error)
    Message({
      message: error,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
