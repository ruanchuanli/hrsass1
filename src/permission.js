import router from '@/router'
import store from '@/store'
// 导入进度条，
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 定义白名单：不需要token就能访问的页面
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  // 开启进度条
  nprogress.start()
  if (store.getters.token) {
    // 如果有token，是登录页面则跳转至主页，否则放行
    if (to.path === '/login') {
      next('/')
    } else {
      // 如果没有用户信息就去获取
      if (!store.getters.userId) {
        // 得加await，不然可能会在还没获取到用户信息时，已经执行next
        await store.dispatch('user/getUserinfos')
      }
      next()
    }
  } else {
    // 如果没有token，并且要去的页面不在白名单中，就去登录，否则放行
    if (whiteList.indexOf(to.path) === -1) {
      next('/login')
    } else {
      next()
    }
  }
  // 关闭进度条
  nprogress.done()
})
router.afterEach(() => {
  nprogress.done()
})
