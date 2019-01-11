import {
  login,
  logout,
  getUserInfo,
  getUserPage
} from '@/api/user'
import {
  setToken,
  getToken,
  setStore,
} from '@/libs/util'

export default {
  state: {
    username: '',
    userId: '',
    avatarImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false
  },
  mutations: {
    setAvatar(state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setUserId(state, id) {
      state.userId = id
    },
    setUserName(state, name) {
      state.username = name
    },
    setAccess(state, access) {
      state.access = access
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status
    }
  },
  actions: {
    // 登录
    handleLogin({
      commit
    }, {
      username,
      password
    }) {
      username = username.trim()
      return new Promise((resolve, reject) => {
        login({
          username,
          password
        }).then(res => {
          const data = res.data
          setToken(data)
          resolve()
        }).catch(err => {
          // reject(err)
          console.log(err)
        })
      })
    },
    // 退出登录
    handleLogOut({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          setToken('')
          commit('setAccess', [])
          resolve()
        }).catch(err => {
          // reject(err)
          console.log(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(res => {
          const data = res.data
          setStore('userInfo',data)
          commit('setAvatar', data.avatar)
          commit('setHasGetInfo', true)
          resolve(data)
        }).catch(err => {
          // reject(err)
          console.log(err)
        })
      })
    },
    getUserPage(params){
      getUserPage(params).then(res=>{
        console.log(res)
      })
    }




  }
}