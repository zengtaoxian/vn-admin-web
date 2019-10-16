import request from '@/utils/request'

var api_name = 'role';

export function addInfo(reqData) {
  return request({
    url: api_name,
    method: 'post',
    data: reqData
  })
}

export function delInfo(reqKey) {
  return request({
    url: api_name + '/' + reqKey,
    method: 'delete'
  })
}

export function mdfInfo(reqKey, reqData) {
  return request({
    url: api_name + '/' + reqKey,
    method: 'put',
    data: reqData
  })
}

export function getInfo(reqKey) {
  return request({
    url: api_name + '/' + reqKey,
    method: 'get'
  })
}

export function getList(reqData) {
  return request({
    url: api_name,
    method: 'get',
    params: reqData
  })
}
