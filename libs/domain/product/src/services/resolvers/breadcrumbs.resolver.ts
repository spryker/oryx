import { INJECTOR, Provider, inject } from '@spryker-oryx/di';
import { RouteType, RouterService } from '@spryker-oryx/router';
import {
  Breadcrumb,
  BreadcrumbsResolver,
  BreadcrumbsResolvers,
} from '@spryker-oryx/site';
import { Observable, map } from 'rxjs';

export class ProductListBreadcrumbsResolver implements BreadcrumbsResolver {
  constructor(protected injector = inject(INJECTOR)) {}

  resolve(): Observable<Breadcrumb[]> {
    return this.injector.inject(RouterService).current().pipe(
      map(({ query }) => [
        {
          i18n: query.q
            ? {
                token: 'product.breadcrumbs.search-for-"<q>"',
                values: query as Record<string, string>,
              }
            : { token: 'product.breadcrumbs.search' },
        },
      ])
    );
  }
}

export const ProductListBreadcrumbs: Provider = {
  provide: `${BreadcrumbsResolvers}${String(
    RouteType.ProductList
  ).toUpperCase()}`,
  useClass: ProductListBreadcrumbsResolver,
};
