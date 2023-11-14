import { RouteType } from '@spryker-oryx/router';
import { RouteConfig } from '@spryker-oryx/router/lit';

export const categoryRoutes: RouteConfig[] = [
  {
    path: '/category/:id',
    type: RouteType.Category,
  },
];
