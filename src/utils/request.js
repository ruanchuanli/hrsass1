import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'
// 设置token超时时间,1h
const timeout = 3600
const service = axios.create({
  // 设置开发环境基础地址
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时时间
  timeout: 8000
})
// 请求拦截器
service.interceptors.request.use(config => {
  // 注入token
  if (store.getters.token) {
    if (istomeout()) {
      // 如果token超时，类似于退出登录，清除token，去登录
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})
// 响应拦截器,参数为两个函数
service.interceptors.response.use(response => {
  // 因为后台返回的数据中都包含以下字段，将其解构，方便使用
  const { data, success, message } = response.data
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message)) // 手动制造错误，让其进入catch中
  }
}, error => {
  // 如果返回回来的错误信息code为10002表示token失效
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error) // 跳出当前执行链，直接进入catch
})

const istomeout = () => {
  const currenttime = Date.now()
  const starttime = getTimeStamp()
  console.log((currenttime - starttime) / 1000, 1234)
  return (currenttime - starttime) / 1000 > timeout
}
export default service
