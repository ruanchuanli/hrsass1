import request from '@/utils/request'

// 登录接口
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 获取用户信息资料
export function getUserinfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

// 获取用户详细信息资料
export function getUserDetailinfo(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
