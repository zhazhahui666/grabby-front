import axios from '@/libs/api.request'

export const getTree = (params) => {
  return axios.request({
    url: 'department/get_tree',
    method: 'get',
    params
  })
}

export const addDepartment = (data) => {
  return axios.request({
    url: 'department/add',
    method: 'post',
    data
  })
}