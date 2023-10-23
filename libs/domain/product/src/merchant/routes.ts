import { RouteType } from '@spryker-oryx/router';
import { RouteConfig } from '@spryker-oryx/router/lit';

export const merchantRoutes: RouteConfig[] = [
  {
    path: '/merchant/:merchant',
    type: RouteType.Merchant,
  },
];
