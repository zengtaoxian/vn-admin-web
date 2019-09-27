import request from '@/utils/request'

export function addInfo(data) {
  return request({
    url: 'admin/user',
    method: 'post',
    data: data
  })
}

export function delInfo(data) {
  return request({
    url: 'user/delete',
    method: 'post',
    data: data
  })
}

export function mdfInfo(data) {
  return request({
    url: 'user/update',
    method: 'post',
    data: data
  })
}

export function getInfo(data) {
  return request({
    url: 'admin/user',
    method: 'get',
    data: data
  })
}

export function resetInfo(data) {
  return request({
    url: 'user/password',
    method: 'post',
    data: data
  })
}

export function getList(data) {
  return request({
    url: 'admin/user',
    method: 'get',
    data: data
  })
}
