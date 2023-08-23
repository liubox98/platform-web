import request from '@/utils/request'

export function fetchList(query, data) {
  return request({
    url: '/case/list',
    method: 'post',
    params: query,
    data
  })
}

export function fetchCase(id) {
  return request({
    url: '/case/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export function createCase(data) {
  return request({
    url: '/case/create',
    method: 'post',
    data
  })
}

export function updateCase(data) {
  return request({
    url: '/case/update',
    method: 'post',
    data
  })
}

export function uploadCase(data) {
  return request({
    url: '/case/upload',
    method: 'post',
    data
  })
}

export function getAssignCase(query) {
  return request({
    url: '/case/assign',
    method: 'get',
    params: query
  })
}

export function chagneAssign(data) {
  return request({
    url: '/case/assign',
    method: 'post',
    data
  })
}

export function chagneAssignDelete(data) {
  return request({
    url: '/case/assignDelete',
    method: 'post',
    data
  })
}

export function getAssignCaseV1(query) {
  return request({
    url: '/case/assign',
    method: 'get',
    params: query
  })
}

export function caseOperation(query) {
  return request({
    url: '/case/operation',
    method: 'get',
    params: query
  })
}

export function assignCaseOperation(data) {
  return request({
    url: '/case/assignCase',
    method: 'post',
    data
  })
}

export function updateCaseOperation(data) {
  return request({
    url: '/case/updateCase',
    method: 'post',
    data
  })
}

export function deleteCase(data) {
  return request({
    url: '/case/deleteCase',
    method: 'post',
    data
  })
}

export function taskDetails(query) {
  return request({
    url: '/case/taskDetails',
    method: 'get',
    params: query
  })
}

export function updateProblemCase(data) {
  return request({
    url: '/case/updateProblemCase',
    method: 'post',
    data
  })
}

export function getProblemCase(query) {
  return request({
    url: '/case/problemCase',
    method: 'get',
    params: query
  })
}

export function deleteProblemCase(id) {
  return request({
    url: '/case/problemCase/' + id,
    method: 'delete'
  })
}
