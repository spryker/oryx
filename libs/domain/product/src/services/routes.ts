import { resolve } from '@spryker-oryx/di';
import { RouteType } from '@spryker-oryx/router';
import { RouteConfig } from '@spryker-oryx/router/lit';
import { map, take } from 'rxjs';
import { ProductService } from './product.service';

export const productRoutes: RouteConfig[] = [
  {
    path: '/product/:sku',
    type: RouteType.Product,
    enter: ({ sku }) =>
      resolve(ProductService)
        .get({ sku })
        .pipe(
          take(1),
          map((product) => (product ? true : RouteType.NotFound))
        ),
  },
];

export const productListRoutes: RouteConfig[] = [
  {
    path: '/search',
    type: RouteType.ProductList,
  },
];
