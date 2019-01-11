import axios from '@/libs/api.request'

export const getPermissionPage = (params) => {
  return axios.request({
    url: 'permission/get_page',
    method: 'get',
    params
  })
}