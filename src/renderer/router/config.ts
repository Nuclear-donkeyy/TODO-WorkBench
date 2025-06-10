import React from 'react';

export interface IRouter {
  name?: string;
  path: string;
  children?: Array<IRouter>;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
}

export const routers: Array<IRouter> = [
  {
    name: '根路由',
    path: '/',
    component: React.lazy(() => import('../App')),
    children: [
      {
        name: '代办列表',
        path: 'todoList',
        component: React.lazy(() => import('../page/TODOPage')),
      },
      {
        name: '日历',
        path: 'calendar',
        component: React.lazy(() => import('../page/CalendarPage')),
      },
      {
        name: '记事本',
        path: 'notebook',
        component: React.lazy(() => import('../page/NotePage')),
      },
      {
        name: '打卡',
        path: 'checkList',
        component: React.lazy(() => import('../page/CheckPage')),
      },
      {
        name: '长期计划',
        path: 'planning',
        component: React.lazy(() => import('../page/PlanningPage')),
      },
      {
        name: '设置',
        path: 'setting',
        component: React.lazy(() => import('../page/SettingPage')),
      },
    ],
  },
];
