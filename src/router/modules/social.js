export default {
  path: '/social',
  name: 'social',
  component: () => import('@/layout'),
  children: [{
    path: '',
    name: 'social',
    component: () => import('@/views/social'),
    meta: {
      title: '社保',
      icon: 'table'
    }
  }]
}
