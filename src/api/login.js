import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'rest_auth/login/',
    method: 'post',
    data: data
  })
}

export function logout() {
  return request({
    url: 'rest_auth/logout/',
    method: 'post'
  })
}
