import request from '@/utils/request'

export function addInfo(data) {
  return request({
    url: 'report/save',
    method: 'post',
    data: data
  })
}

export function delInfo(data) {
  return request({
    url: 'report/delete',
    method: 'post',
    data: data
  })
}

export function mdfInfo(data) {
  return request({
    url: 'report/update',
    method: 'post',
    data: data
  })
}

export function getInfo(data) {
  return request({
    url: 'report/info',
    method: 'post',
    data: data
  })
}

export function getList(data) {
  return request({
    url: 'report/list',
    method: 'post',
    data: data
  })
}
