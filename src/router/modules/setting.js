export default {
  path: '/setting',
  name: 'setting',
  component: () => import('@/layout'),
  children: [{
    path: '',
    name: 'setting',
    component: () => import('@/views/setting'),
    meta: {
      title: '公司设置',
      icon: 'setting'
    }
  }]
}
