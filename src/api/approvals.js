import request from '@/utils/request'

// 获取审批列表
export const getApprovalsList = (data) => request({
  url: `/user/process/instance/${data.page}/${data.size}`,
  method: 'put',
  data
})
// 查询所有的流程定义
export const getDefinitionList = () => request({
  url: `/user/process/definition`
})

// 查询审批单的详情数据
export const getProcessDetail = (id) => request({
  url: `/user/process/instance/${id}`
})
