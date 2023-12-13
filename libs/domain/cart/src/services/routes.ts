import { RouteType } from '@spryker-oryx/router';
import { RouteConfig } from '@spryker-oryx/router/lit';

export const cartRoutes: RouteConfig[] = [
  {
    path: '/my-account/carts',
    type: RouteType.Carts,
  },
];
