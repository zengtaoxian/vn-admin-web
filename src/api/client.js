import request from '@/utils/request'

export function addInfo(data) {
  return request({
    url: 'client/save',
    method: 'post',
    data: data
  })
}

export function delInfo(data) {
  return request({
    url: 'client/delete',
    method: 'post',
    data: data
  })
}

export function mdfInfo(data) {
  return request({
    url: 'client/save',
    method: 'post',
    data: data
  })
}

export function getInfo(data) {
  return request({
    url: '/client/info',
    method: 'post',
    data: data
  })
}

export function getList(data) {
  return request({
    url: 'client/list',
    method: 'post',
    data: data
  })
}
