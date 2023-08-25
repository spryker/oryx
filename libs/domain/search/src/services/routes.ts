import { resolve } from '@spryker-oryx/di';
import { ProductListPageService } from '@spryker-oryx/product';
import { RouteType } from '@spryker-oryx/router';
import { RouteConfig } from '@spryker-oryx/router/lit';
import { map, take } from 'rxjs';

export const categoryRoutes: RouteConfig[] = [
  {
    path: '/category/:id',
    type: RouteType.Category,
    enter: () =>
      resolve(ProductListPageService)
        .get()
        .pipe(
          take(1),
          map((facets) => (facets ? true : RouteType.NotFound))
        ),
  },
];
