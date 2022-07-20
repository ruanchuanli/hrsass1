// vuex的权限模块
// 控制不同用户的权限访问路由
// 获取静态路由constantRoutes和所有的动态路由
import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  // 默认所有的用户都有静态路由的权限
  routes: constantRoutes
}
const mutations = {
  // 为用户添加新的路由模块
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // 筛选出用户拥有的路由
  filterRoutes(context, menus) {
    const routes = []
    asyncRoutes.forEach(item => {
      menus.forEach(menu => {
        if (menu === item.name) {
          routes.push(item)
        }
      })
    })
    context.commit('setRoutes', routes)
    return routes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
