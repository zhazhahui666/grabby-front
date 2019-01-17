import axios from '@/libs/api.request'

export const login = ({ username, password }) => {
  return axios.request({
    url: 'user/login',
    data:{ username, password },
    method: 'post'
  })
}

export const getUserInfo = () => {
  return axios.request({
    url: 'user/get_user_info',
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}


export const getUserPage = (params) => {
  return axios.request({
    url: 'user/get_page',
    method: 'get',
    params
  })
}

export const addUser = (user) => {
  return axios.request({
    url: 'user/add',
    method: 'post',
    data:user
  })
}



export const resetPassword = (uid) => {
  return axios.request({
    url: 'user/reset_password/'+uid,
    method: 'get',
  })
}




export const selfUpdate = (data) => {
  return axios.request({
    url: 'user/self-update',
    method: 'post',
    data
  })
}