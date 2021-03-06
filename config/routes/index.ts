
export default [
  {
    name: 'project',
    icon: 'project',
    iconfont: 'project',
    path: '/',
    redirect: '/abtest/experiment',
    exact: true,
  },
  {
    name: 'project',
    icon: 'project',
    iconfont: 'project',
    path: '/',
    routes:[
      {
        name: '实验管理',
        icon: 'project',
        iconfont: 'project',
        path: '/abtest/experiment',
        component: './Abtest/Experiment',
        access: 'canDeleteFoo',
        exact: true,
      },
      {
        name: '受众管理',
        icon: 'project',
        iconfont: 'project',
        path: '/abtest/audience',
        component: './Abtest/Audience',
        exact: true,
      },
      {
        name: '变量管理',
        icon: 'project',
        iconfont: 'project',
        path: '/abtest/variable',
        component: './Abtest/Variable',
        exact: true,
      },
      {
        name: '实验层管理',
        icon: 'project',
        iconfont: 'project',
        path: '/abtest/laboratory',
        component: './Abtest/Laboratory',
        exact: true,
      },
      {
        name: '列表页',
        path: '/demo/list',
        component: './Demo/list',
        exact: true,
      },
      {
        name: '详情页',
        path: '/demo/detail',
        component: './Demo/detail',
        exact: true,
        hideInMenu: true,
      },
      {
        name: '首页',
        icon: 'home',
        iconfont: 'home',
        path: '/home',
        component: './Home',
        exact: true,
      },
      {
        name: 'profile',
        icon: 'profile',
        iconfont: 'profile',
        path: '/profile',
        component: './Profile',
        exact: true,
      },
      {
        component: './404',
      },
    ]
  },
  {
    component: './404',
  },
];
