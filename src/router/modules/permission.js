export default {
  path: '/permission',
  name: 'permission',
  component: () => import('@/layout'),
  children: [{
    path: '',
    name: 'permission',
    component: () => import('@/views/permission'),
    meta: {
      title: '权限管理',
      icon: 'lock'
    }
  }]
}
