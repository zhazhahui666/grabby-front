import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import iview from 'iview'
import i18n from '@/locale'
import config from '@/config'
import {formatDate} from '@/libs/date'
import {
  setToken,
  getToken,
  setStore,
  clearObj
} from '@/libs/util'



import 'iview/dist/styles/iview.css';
// import './index.less'
import './common.less'
import '@/assets/icons/iconfont.css'

Vue.use(iview, {
  i18n: (key, value) => i18n.t(key, value),
  size: 'small'
})

Vue.filter('formatDate', formatDate)


/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false


/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

/**
 * @description 注册全局方法
 */
Vue.prototype.setToken = setToken
Vue.prototype.getToken = getToken
Vue.prototype.setStore = setStore
Vue.prototype.clearObj = clearObj





new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
