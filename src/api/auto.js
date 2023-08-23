import request from '@/utils/request'

export function tempList(params) {
  return request({
    url: '/temp/list',
    method: 'get',
    params
  })
}

export function tempCreate(data) {
  return request({
    url: '/temp/create',
    method: 'post',
    data
  })
}

export function tempDelete(data) {
  return request({
    url: '/temp/delete',
    method: 'post',
    data
  })
}

export function tempUpdate(data) {
  return request({
    url: '/temp/update',
    method: 'post',
    data
  })
}

export function getAssignModule(data) {
  return request({
    url: '/temp/getAssign',
    method: 'post',
    data
  })
}

export function chagneAssign(data) {
  return request({
    url: '/temp/assign',
    method: 'post',
    data
  })
}

export function chagneAssignDel(data) {
  return request({
    url: '/temp/assignDel',
    method: 'post',
    data
  })
}

export function getDetails(data) {
  return request({
    url: '/temp/getDetails',
    method: 'post',
    data
  })
}

export function fetchAtutoList(params) {
  return request({
    url: '/auto/list',
    method: 'get',
    params
  })
}

export function createAuto(data) {
  return request({
    url: '/auto/add',
    method: 'post',
    data
  })
}

export function updateAuto(data) {
  return request({
    url: '/auto/update',
    method: 'post',
    data
  })
}

export function distributeAuto(data) {
  return request({
    url: '/auto/distribute',
    method: 'post',
    data
  })
}

export function deleteAuto(data) {
  return request({
    url: '/auto/delete',
    method: 'post',
    data
  })
}

export function implement(query, data) {
  return request({
    url: '/autorun/implement',
    method: 'post',
    params: query,
    data
  })
}

export function updateReport(data) {
  return request({
    url: '/autorun/updateReport',
    method: 'post',
    data
  })
}

export function updateStatus(data) {
  return request({
    url: '/autorun/updateStatus',
    method: 'post',
    data
  })
}

export function autoOperation(params) {
  return request({
    url: '/autorun/operation',
    method: 'get',
    params
  })
}
