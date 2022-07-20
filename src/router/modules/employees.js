export default {
  path: '/employees',
  name: 'employees',
  component: () => import('@/layout'),
  children: [{
    path: '',
    name: 'employees',
    component: () => import('@/views/employees'),
    meta: {
      title: '员工',
      icon: 'people'
    }
  },
  {
    path: 'detail/:id',
    name: 'detail',
    component: () => import('@/views/employees/detail'),
    meta: {
      title: '员工详情信息'
    },
    hidden: true
  },
  {
    path: 'print/:id',
    name: 'print',
    component: () => import('@/views/employees/print'),
    meta: {
      title: '员工信息打印'
    },
    hidden: true
  }
  ]
}
