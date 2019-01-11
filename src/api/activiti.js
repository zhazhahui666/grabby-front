import axios from '@/libs/api.request'

export const getMyApply = (params) => {
  return axios.request({
    url: 'act-process/get_my_apply',
    method: 'get',
    params
  })
}


export const getDoneList = (params) => {
  return axios.request({
    url: 'act-process/done-list',
    method: 'get',
    params
  })
}

export const getTodoList = (params) => {
  return axios.request({
    url: 'act-process/todo-list',
    method: 'get',
    params
  })
}


export const getProcesscategory = (params) => {
  return axios.request({
    url: 'act-category/get-process-category',
    method: 'get',
    params
  })
}



export const startProcess = ({
  processKey
}) => {
  return axios.request({
    url: `act-process/start-process/${processKey}`,
    method: 'get'
  })
}

export const getModelPage = (params) => {
  return axios.request({
    url: 'act-process/get-model-page',
    method: 'get',
    params
  })
}



export const taskPass = ({
  taskId
}) => {
  return axios.request({
    url: 'act-process/pass',
    method: 'post',
    data: {
      taskId
    }
  })
}

//创建模型
export const createModel = () => {
  return axios.request({
    url: 'activiti-explorer/service/create',
    method: 'get',
  })
}

//获取流程定义所有节点
export const getActNodes = ({
  processId,
  pageNumber,
  pageSize
}) => {
  return axios.request({
    url: `act-node-config/get-page/${processId}`,
    method: 'get',
    params: {
      pageNumber,
      pageSize
    }
  })
}
//更新节点操作人
export const updateActNodeHandler = ({
  nodeConfigId,
  handlerType,
  handler,
  handlerName
}) => {
  return axios.request({
    url: `act-node-config/update-node-handler/`,
    method: 'post',
    data: {
      nodeConfigId,
      handlerType,
      handler,
      handlerName
    }
  })
}


//添加流程
export const addProcess = ({
  processName,
  categoryId
}) => {
  return axios.request({
    url: 'act-process/add',
    method: 'post',
    data: {
      processName,
      categoryId
    }
  })
}

//部署流程
export const deployProcess = (processId) => {
  return axios.request({
    url: `act-process/deploy/${processId}`,
    method: 'get'
  })
}

//删除流程
export const deleteProcess = (processId) => {
  return axios.request({
    url: `act-process/delete/${processId}`,
    method: 'get'
  })
}