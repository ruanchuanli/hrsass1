export default {
  path: '/approvals',
  name: 'approvals',
  component: () => import('@/layout'),
  children: [{
    path: '',
    name: 'approvals',
    component: () => import('@/views/approvals'),
    meta: {
      title: '审批',
      icon: 'tree-table'
    }
  }]
}
