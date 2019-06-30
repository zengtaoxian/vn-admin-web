import request from '@/utils/request'

export function addInfo(data) {
  return request({
    url: '/client/add',
    method: 'post',
    data: data
  })
}

export function delInfo(data) {
  return request({
    url: '/client/del',
    method: 'get',
    params: data
  })
}

export function mdfInfo(data) {
  return request({
    url: '/client/mdf',
    method: 'post',
    params: data
  })
}

export function getInfo(data) {
  return request({
    url: '/client/info',
    method: 'post',
    params: data
  })
}

export function getList(data) {
  return request({
    url: '/client/list',
    method: 'post',
    params: data
  })
}
