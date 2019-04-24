import axios from 'axios';
import router from '@/router';
import { Message } from 'element-ui';
import stores from '../store';

const service = axios.create({
	timeout: 20000 // 请求超时时间
});
//* 请求拦截
service.interceptors.request.use(config => {
	config.headers['Content-Type'] = 'application/json;charset=UTF-8'; //* 提交类型为FormData  默认的是为request payload
  if (stores.state.login.token) {
    config.headers.Authorization = stores.state.login.token;
  }
	return config
}, error => Promise.reject(err));

service.interceptors.response.use(
	response => {
		//*	服务器	session	超时,重新登录
		if (response.data.code === 'ERROR_LOGIN') {
			Message({
				message: '登录超时，请重新登录',
				type: 'error',
				showClose: true
			})
			sessionStorage.clear();
			router.push('/');
		}else if(response.data.respCode == '1002'){
      router.push('/login');
    }

		return response
	}, error => {

		Message({
			message: '请求超时，请刷新页面！',
			showClose: true,
			type: 'error',
			duration: 5 * 1000
		});
		return Promise.reject(error);
	}
)

export default service;
