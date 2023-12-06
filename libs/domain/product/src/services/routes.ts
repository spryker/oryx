import { RouteType } from '@spryker-oryx/router';
import { RouteConfig } from '@spryker-oryx/router/lit';

export const productRoutes: RouteConfig[] = [
  {
    path: '/product/:sku',
    type: RouteType.Product,
  },
  {
    path: '/search',
    type: RouteType.ProductList,
  },
];
