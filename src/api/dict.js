import axios from '@/libs/api.request'

export const getOptionPage = (params) => {
  return axios.request({
    url: 'dict/get-option-page',
    method: 'get',
    params
  })
}


export const getPage = (params) => {
  return axios.request({
    url: 'dict/get-page',
    method: 'get',
    params
  })
}


export const getOptionByCode = (dictCode) => {
  return axios.request({
    url: `dict/get-option-by-code`,
    method: 'get',
    params: {
      dictCode
    }
  })
}

//新增或修改字典
export const saveOrUpdateDict = (data) => {
  return axios.request({
    url: `dict/save-or-update-dict`,
    method: 'post',
    data
  })
}