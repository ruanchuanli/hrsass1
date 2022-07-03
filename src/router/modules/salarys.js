export default {
  path: '/salarys',
  name: 'salarys',
  component: () => import('@/layout'),
  children: [{
    path: '',
    name: 'salarys',
    component: () => import('@/views/salarys'),
    meta: {
      title: '工资',
      icon: 'money'
    }
  }]
}
