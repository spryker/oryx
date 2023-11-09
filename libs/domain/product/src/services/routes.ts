import { RouteType } from '@spryker-oryx/router';
import { RouteConfig } from '@spryker-oryx/router/lit';

export const productRoutes: RouteConfig[] = [
  {
    path: '/product/:sku',
    type: RouteType.Product,
    // enter: ({ sku }) =>
    //   resolve(ProductService)
    //     .get({ sku })
    //     .pipe(
    //       take(1),
    //       map((product) => (product ? true : RouteType.NotFound))
    //     ),
  },
  {
    path: '/search',
    type: RouteType.ProductList,
  },
];
