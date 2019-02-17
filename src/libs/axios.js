import axios from 'axios'
import store from '@/store'
import {
  Message
} from 'iview'
import {
  setToken,
  getToken,
  setStore
} from '@/libs/util'
// import { Spin } from 'iview'
const addErrorLog = errorInfo => {
  const {
    statusText,
    status,
    request: {
      responseURL
    }
  } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    }
    return config
  }
  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true

      if (!config.url.includes('user/login')) {
        config.headers['accessToken'] = getToken()
      }

      //文件上传
      if (config.isMultipart) {
        config.headers = {
          'Content-Type': 'multipart/form-data'
        }
      } else if (config.method === 'post' || 'put') {
        //处理成表单形式参数
        config.transformRequest = [function (data) {
          let ret = '';
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
          }
          ret = ret.slice(0, -1);
          return ret;
        }]
      }
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      const is = this.destroy(url)
      if (!is) {
        setTimeout(() => {
          // Spin.hide()
        }, 500)
      }
      const data = res.data
      if (data.success === true) return data;

      //错误情况
      switch (data.code) {
        case 401:
          // 未登录 清除已登录状态
          setToken('')
          setStore('userInfo', '')
          router.push('/login');
          break;
        case 403:
          // 没有权限
          if (data.message !== null) {
            Message.error(data.message);
          } else {
            Message.error("未知错误");
          }
          break;
        case 500:
          // 错误
          if (data.message !== null) {
            Message.error(data.message);
          } else {
            Message.error("未知错误");
          }
          break;
        default:
          Message.error("未知错误");
          break;
      }
      //错误情况返回reject
      return Promise.reject('error')

      // return data;
    }, (error) => {
      Message.error('服务内部错误')
      // 对响应错误做点什么
      return Promise.reject(error)
    })
  }
  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest