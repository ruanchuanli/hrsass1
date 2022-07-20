import request from '@/utils/request'

// 获取员工简单列表
export const getEmployeesSimple = () => request({
  url: '/sys/user/simple'
})

// 获取员工列表
export const getEmployees = (params) => request({
  url: `/sys/user`,
  params
})

// 根据id删除员工
export const delEmployee = (id) => request({
  url: `/sys/user/${id}`,
  method: 'DELETE'
})

// 新增员工
export const addEmployee = (data) => request({
  url: `/sys/user`,
  method: 'post',
  data
})

// 批量新增员工
export const addEmployees = (data) => request({
  url: `/sys/user/batch`,
  method: 'post',
  data
})

// 获取用户基本信息,用户id
export const getUserBaseInfo = (id) => request({
  url: `/sys/user/${id}`
})

// 保存用户基本信息,用户id
export const saveUserBaseInfo = (data) => request({
  url: `/sys/user/${data.id}`,
  method: 'PUT',
  data
})

// 获取用户个人信息,用户id
export const getUserPersonInfo = (id) => request({
  url: `/employees/${id}/personalInfo`
})
// 保存用户个人信息,用户id
export const saveUserPersonInfo = (data) => request({
  url: `/employees/${data.id}/personalInfo`,
  method: 'PUT',
  data
})

// 获取用户岗位信息,用户id
export const getUserJobInfo = (id) => request({
  url: `/employees/${id}/jobs`
})

// 保存用户岗位信息,用户id
export const saveUserJobInfo = (data) => request({
  url: `/employees/${data.id}/jobs`,
  method: 'PUT',
  data
})

// 给用户分配角色
export const assignRoles = (data) => request({
  url: `/sys/user/assignRoles`,
  method: 'PUT',
  data
})

