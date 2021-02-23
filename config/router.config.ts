import routes from './routes';

export default [
  {
    name: '登录',
    icon: 'login',
    iconfont: 'login',
    path: '/login',
    component: './Login',
    exact: true,
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: routes
  },
  {
    component: './404',
  },
];
