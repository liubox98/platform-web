import request from '@/utils/request'

export function fetchCommitList(params) {
  return request({
    url: '/commit/list',
    method: 'get',
    params
  })
}

export function updateCommitStatus(data) {
  return request({
    url: '/commit/update',
    method: 'post',
    data
  })
}

export function updateIgnoreStatus(data) {
  return request({
    url: '/commit/updateIgnore',
    method: 'post',
    data
  })
}
