import request from '@/utils/request'

export function addInfo(data) {
  return request({
    url: 'rate/save',
    method: 'post',
    data: data
  })
}

export function delInfo(data) {
  return request({
    url: 'rate/delete',
    method: 'post',
    data: data
  })
}

export function mdfInfo(data) {
  return request({
    url: 'rate/update',
    method: 'post',
    data: data
  })
}

export function getInfo(data) {
  return request({
    url: '/rate/info',
    method: 'post',
    data: data
  })
}

export function getList(data) {
  return request({
    url: 'rate/list',
    method: 'post',
    data: data
  })
}
