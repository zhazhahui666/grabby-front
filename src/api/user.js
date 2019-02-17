import axios from '@/libs/api.request'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

export const login = ({
  username,
  password
}) => {
  return axios.request({
    url: 'user/login',
    data: {
      username,
      password
    },
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
    data: user
  })
}



export const resetPassword = (uid) => {
  return axios.request({
    url: 'user/reset_password/' + uid,
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

//下载导入模板
export const downloadTemplateUrl  =`${baseUrl}/api/user/download-import-template`

export const importUser = (data) => {
  return axios.request({
    url: '/user/import',
    method: 'post',
    data,
    isMultipart:true
  })
}


