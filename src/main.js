import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import * as directives from '@/directives'
import * as filters from '@/filters'
import Component from '@/components'
import checkPermission from '@/mixin/checkPermission'
// 使用Mixin技术将检查方法注入，全局方法，组件中都可使用
Vue.mixin(checkPermission)
Vue.use(Component)
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
console.log(directives, 11)
// 将directives的key全部取出，变成数组
Object.keys(directives).forEach(item => {
  Vue.directive(item, directives[item])
})

// 注册全局的过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
