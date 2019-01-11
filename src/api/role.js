import axios from '@/libs/api.request'

export const getRolePage = (params) => {
  return axios.request({
    url: 'role/get_page',
    method: 'get',
    params
  })
}

export const saveOrUpdateRole = ({id,name,description}) => {
  return axios.request({
    url: 'role/save-or-update',
    method: 'post',
    data:{
      id,
      name,
      description
    }
  })
}


export const addUserRole = (data) => {
  return axios.request({
    url: 'user-role/add',
    method: 'post',
   data
  })
}

export const deleteRole = (roleId) => {
  return axios.request({
    url: `role/delete/${roleId}`,
    method: 'get',
  })
}