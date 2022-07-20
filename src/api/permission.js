import request from '@/utils/request'

// 获取所有权限点
export const getPermList = () => request({
  url: '/sys/permission'
})

// 获取所有权限点
export const addPerm = (data) => request({
  url: '/sys/permission',
  method: 'post',
  data
})
// 删除权限点
export const delPerm = (id) => request({
  url: `/sys/permission/${id}`,
  method: 'delete'
})
// 根据ID获取权限点详情
export const getPermDetail = (id) => request({
  url: `/sys/permission/${id}`
})

// 根据ID修改权限点详情
export const putPermDetail = (data) => request({
  url: `/sys/permission/${data.id}`,
  method: 'put',
  data
})

