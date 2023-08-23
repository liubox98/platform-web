import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/task/list',
    method: 'post',
    params: query
  })
}

export function deleteArticle(data) {
  return request({
    url: '/task/delete',
    method: 'post',
    data
  })
}

export function fetchPv(pv) {
  return request({
    url: '/task/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/task/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/task/update',
    method: 'post',
    data
  })
}

export function resetCaseStatus(data) {
  return request({
    url: '/task/resetCaseStatus',
    method: 'post',
    data
  })
}

export function retractCase(data) {
  return request({
    url: '/task/retractCase',
    method: 'post',
    data
  })
}

export function activity(data) {
  return request({
    url: '/task/activity',
    method: 'get',
    params: data
  })
}

export function visual(data) {
  return request({
    url: '/task/visual',
    method: 'get',
    params: data
  })
}
