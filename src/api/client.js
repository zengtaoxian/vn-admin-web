import request from '@/utils/request'

export function addInfo(data) {
  return request({
    url: 'client',
    method: 'post',
    data: data
  })
}

export function delInfo(data) {
  return request({
    url: 'client',
    method: 'delete',
    data: data
  })
}

export function mdfInfo(data) {
  return request({
    url: 'client',
    method: 'update',
    data: data
  })
}

export function getInfo(data) {
  return request({
    url: 'client',
    method: 'get',
    params: data
  })
}

export function resetInfo(data) {
  return request({
    url: 'client',
    method: 'update',
    data: data
  })
}

export function getList(data) {
  return request({
    url: 'client',
    method: 'get',
    data: data
  })
}
