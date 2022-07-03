import request from '@/utils/request'

/**
 * 获得所有部门
 * @returns
 */
export const getdepartments = () => request({
  url: '/company/department'
})

/**
 * 删除指定部门
 * @returns
 */
export const deldepartments = (id) => request({
  url: `/company/department/${id}`,
  method: 'delete'
})

/**
 * 添加部门
 * @returns
 */
export const adddepartments = (data) => request({
  url: `/company/department`,
  method: 'post',
  data
})

/**
 * 根据部门id获取部门详情
 * @returns
 */
export const getdetaildeptinfo = (id) => request({
  url: `/company/department/${id}`
})

/**
 * 根据部门id修改部门详情
 * @returns
 */
export const editdetaildeptinfo = (data) => request({
  url: `/company/department/${data.id}`,
  method: 'put',
  data
})
