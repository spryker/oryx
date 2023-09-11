import { RouteType } from '@spryker-oryx/router';
import { RouteConfig } from '@spryker-oryx/router/lit';

export const categoryRoutes: RouteConfig[] = [
  {
    path: '/category/:id',
    type: RouteType.Category,
    // TODO: uncomment when HRZ-89741 will be solved
    // enter: () =>
    //   resolve(ProductListPageService)
    //     .get()
    //     .pipe(
    //       take(1),
    //       map((facets) => (facets ? true : RouteType.NotFound))
    //     ),
  },
];
