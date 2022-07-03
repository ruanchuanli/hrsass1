import request from '@/utils/request'

// 获取员工简单列表
export const getEmployeesSimple = () => request({
  url: '/sys/user/simple'
})
