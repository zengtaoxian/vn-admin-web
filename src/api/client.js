import request from '@/utils/request'

export function addInfo(reqData) {
  return request({
    url: 'client',
    method: 'post',
    data: reqData
  })
}

export function delInfo(reqKey) {
  return request({
    url: 'client/' + reqKey,
    method: 'delete'
  })
}

export function mdfInfo(reqKey, reqData) {
  return request({
    url: 'client/' + reqKey,
    method: 'put',
    data: reqData
  })
}

export function getInfo(reqKey) {
  return request({
    url: 'client/' + reqKey,
    method: 'get'
  })
}

export function resetInfo(reqKey, reqData) {
  return request({
    url: 'client/reset/' + reqKey,
    method: 'patch',
    data: reqData
  })
}

export function getList(reqData) {
  return request({
    url: 'client',
    method: 'get',
    params: reqData
  })
}
