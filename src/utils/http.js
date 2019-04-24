import stores from '../store'
import * as types from '../store/types'
import axios from 'axios'
import qs from 'qs'
import router from '../router'

// import {Toast} from 'mint-ui'

let instance = axios.create({
    'Content-Type': 'application/x-www-form-urlencoded',
    post: {
        'Accept': 'text/html',
        'Content-Type': 'application/json'
    },
    // transformRequest: [function (data) {
    //   return qs.stringify(data)
    // }],
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    // timeout: 5000,
    baseURL: process.env.API_ROOT,
    // withCredentials:true
})


//添加一个请求拦截器
instance.interceptors.request.use(function(config) {
    stores.dispatch('showLoading');
    if (stores.state.token) {
        // config.headers.Authorization = stores.state.token;
        config.headers.Authorization = stores.state.login.token;
    }
    //在请求发送之前做一些事
    return config;
}, function(error) {
    console.log(error)
        //当出现请求错误是做一些事
    return Promise.reject(error);
});

//添加一个返回拦截器
instance.interceptors.response.use(function(response) {
    //对返回的数据进行一些处理
    stores.dispatch('hideLoading');
    // 401表示登录失效
    if (response.data.code == '401') {
        switch (response.data.code) {
            case '401':
                // 401 清除token信息并跳转到登录页面
                stores.commit(types.LOGINOUT);
                router.replace({
                    path: '/login',
                    // query: {redirect: router.currentRoute.fullPath}
                    query: { redirect: '/main' }
                })
        }
    }
    return response;
}, function(error) {
    console.log(error.response)
    switch (error.response.status) {
        case 504:
            // Toast('504,服务器器错误');
            break;
        case 500:
            // Toast('500,服务器器错误');
            break;
    }
    // stores.dispatch('hideLoading');
    //对返回的错误进行一些处理
    return Promise.reject(error);
});


export default {
    install: function(vm) {
        vm.prototype.$http = instance
    }
}