import { RouteType } from '@spryker-oryx/router';
import { RouteConfig } from '@spryker-oryx/router/lit';

export const orderRoutes: RouteConfig[] = [
  {
    path: '/order/:id',
    type: RouteType.Order,
  },
];
