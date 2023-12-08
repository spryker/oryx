import { RouteConfig } from '@spryker-oryx/router/lit';

export const articleRoutes: RouteConfig[] = [
  {
    path: '/faq/:id',
    type: 'faq',
  },
  {
    path: '/article/:id',
    type: 'article',
  },
  {
    path: '/about/:id',
    type: 'about',
  },
];
