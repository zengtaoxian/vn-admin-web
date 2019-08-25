import request from '@/utils/request'

export function addInfo(data) {
  return request({
    url: 'ring/save',
    method: 'post',
    data: data
  })
}

export function delInfo(data) {
  return request({
    url: 'ring/delete',
    method: 'post',
    data: data
  })
}

export function mdfInfo(data) {
  return request({
    url: 'ring/update',
    method: 'post',
    data: data
  })
}

export function getInfo(data) {
  return request({
    url: 'ring/info',
    method: 'post',
    data: data
  })
}

export function getList(data) {
  return request({
    url: 'ring/list',
    method: 'post',
    data: data
  })
}
