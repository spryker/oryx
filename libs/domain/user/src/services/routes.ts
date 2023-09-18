import { RouteType } from '@spryker-oryx/router';
import { RouteConfig } from '@spryker-oryx/router/lit';

export const userRoutes: RouteConfig[] = [
  {
    path: '/account/:page',
    type: RouteType.Account,
  },
];
