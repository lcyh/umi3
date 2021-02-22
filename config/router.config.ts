import routes from './routes';

export default [
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: routes
  },
  {
    component: './404',
  },
];
