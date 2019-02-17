import axios from '@/libs/api.request'

export const getDirectoryTree = () => {
  return axios.request({
    url: 'document/get-directory-tree',
    method: 'get',
  })
}

export const getPage = ({dirId,pageNumber,pageSize}) => {
  return axios.request({
    url: `document/get-page`,
    method: 'get',
    params:{
      dirId,
      pageNumber,
      pageSize
    }
  })
}

//获取文档详情
export const getDetail = (documentId) => {
  return axios.request({
    url: `document/get-detail/${documentId}`,
    method: 'get',
    params:{
      documentId
    }
  })
}


//新增文档
export const saveOrUpdate = (data) => {
  return axios.request({
    url: `document/save`,
    method: 'post',
    data
  })
}



