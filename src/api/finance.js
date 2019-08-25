import request from '@/utils/request'

export function addInfo(data) {
  return request({
    url: 'finance/save',
    method: 'post',
    data: data
  })
}

export function delInfo(data) {
  return request({
    url: 'finance/delete',
    method: 'post',
    data: data
  })
}

export function mdfInfo(data) {
  return request({
    url: 'finance/update',
    method: 'post',
    data: data
  })
}

export function getInfo(data) {
  return request({
    url: 'finance/info',
    method: 'post',
    data: data
  })
}

export function getList(data) {
  return request({
    url: 'finance/list',
    method: 'post',
    data: data
  })
}
