
// 导入操作在本地的token的方法
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
// 导入登录接口的api
import { login, getUserinfo, getUserDetailinfo } from '@/api/user'
import { resetRouter } from '@/router'
import store from '@/store'
const state = {
  token: getToken(),
  userInfo: {} // 不写为null，防止null.xxx报错
}
const mutations = {
  // 设置token值
  setToken(state, token) {
    state.token = token
    // 将token值存到本地中
    setToken(token)
  },
  removeToken(state) {
    // 将token设置为空空
    state.token = null
    // 同时也将本地中的token清除
    removeToken()
  },

  // 设置用户信息
  setUserinfo(state, payload) {
    state.userInfo = payload
  },
  removeUserinfo(state) {
    state.userInfo = {}
  }
}
// 请求数据的方法写在actions中
const actions = {
  // 登录
  async login(context, datas) {
    // axiso响应拦截器已经处理了返回的数据，直接使用
    const result = await login(datas)
    console.log(result, 111)
    context.commit('setToken', result)
    // 登录的时候设置时间戳,在axios请求拦截器中获取
    setTimeStamp()
  },
  // 获取用户信息
  async getUserinfos(context) {
    const result = await getUserinfo()
    const detailinfo = await getUserDetailinfo(result.userId)
    context.commit('setUserinfo', { ...result, ...detailinfo })
    return result // 用于下次权限操作
  },
  // 退出
  async logout(context) {
    context.commit('removeToken') // 删除vuex中的token和本地存储的token
    context.commit('removeUserinfo')
    // 重置路由
    resetRouter()
    // 调用父级下permission中的设置路由方法
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

