import request from '@/utils/request'

// 查询所有角色信息
export const getRoleInfo = (params) => request({
  url: '/sys/role',
  params
})

// 根据公司id查询企业
export const getCompanyInfo = (companyId) => request({
  url: `/company/${companyId}`
})

// 根据角色id删除角色信息
export const delRoleInfo = (id) => request({
  url: `/sys/role/${id}`,
  method: 'DELETE'
})

// 根据角色id修改角色信息
export const editRoleInfo = (data) => request({
  url: `/sys/role/${data.id}`,
  method: 'put',
  data
})

// 根据角色id获取角色详细信息
export const getRoleDetailInfo = (id) => request({
  url: `/sys/role/${id}`
})

// 根添加角色信息
export const addRoleInfo = (data) => request({
  url: `/sys/role`,
  method: 'POST',
  data
})
// 给用户分配权限
export const assignPerm = (data) => request({
  url: `/sys/role/assignPrem`,
  method: 'put',
  data
})
