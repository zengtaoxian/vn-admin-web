import request from '@/utils/request'

export function addInfo(data) {
  return request({
    url: 'number/save',
    method: 'post',
    data: data
  })
}

export function delInfo(data) {
  return request({
    url: 'number/delete',
    method: 'post',
    data: data
  })
}

export function mdfInfo(data) {
  return request({
    url: 'number/update',
    method: 'post',
    data: data
  })
}

export function getInfo(data) {
  return request({
    url: '/number/info',
    method: 'post',
    data: data
  })
}

export function resetInfo(data) {
  return request({
    url: '/number/reset',
    method: 'post',
    data: data
  })
}

export function getList(data) {
  return request({
    url: 'number/list',
    method: 'post',
    data: data
  })
}
