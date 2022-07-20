import store from '@/store'
export default {
  methods: {
    checkPermission(key) {
      if (store.state.userInfo && store.state.userInfo.roles.points.length) {
        return store.state.userInfo.roles.points.some(item => item === key)
      }
      return false
    }
  }
}
