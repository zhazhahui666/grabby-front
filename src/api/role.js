import axios from '@/libs/api.request'

export const getRolePage = (params) => {
  return axios.request({
    url: 'role/get_page',
    method: 'get',
    params
  })
}

export const saveOrUpdateRole = ({ id, name, description }) => {
  return axios.request({
    url: 'role/save-or-update',
    method: 'post',
    data: {
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


//获取角色下的用户
export const getUserByRole = ({ roleId, pageNumber, pageSize }) => {
  return axios.request({
    url: `role/get-user-list/${roleId}`,
    method: 'get',
    params: {
      pageNumber,
      pageSize
    }
  })
}

//获取角色下的权限
export const getPermissionTree = ( roleId ) => {
  return axios.request({
    url: `role/get-permission-tree/${roleId}`,
    method: 'get',
  })
}


//获取角色下的权限
export const saveRolePermisisons = ( {roleId,permissionIds} ) => {
  return axios.request({
    url: `permission/save-role-permissions/${roleId}`,
    method: 'post',
    data:{
      permissionIds
    }
  })
}

