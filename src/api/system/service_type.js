import request from '@/utils/request'

export function addInfo(reqData) {
  return request({
    url: 'service_type',
    method: 'post',
    data: reqData
  })
}

export function delInfo(reqKey) {
  return request({
    url: 'service_type/' + reqKey,
    method: 'delete'
  })
}

export function mdfInfo(reqKey, reqData) {
  return request({
    url: 'service_type/' + reqKey,
    method: 'put',
    data: reqData
  })
}

export function getInfo(reqKey) {
  return request({
    url: 'service_type/' + reqKey,
    method: 'get'
  })
}

export function getList(reqData) {
  return request({
    url: 'service_type',
    method: 'get',
    params: reqData
  })
}
