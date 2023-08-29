import { Provider, inject } from '@spryker-oryx/di';
import { RouteType, RouterService } from '@spryker-oryx/router';
import {
  BreadcrumbItem,
  BreadcrumbResolver,
  BreadcrumbResolvers,
} from '@spryker-oryx/site';
import { Observable, map } from 'rxjs';

export class ProductListBreadcrumbResolver implements BreadcrumbResolver {
  constructor(protected routerService = inject(RouterService)) {}

  resolve(): Observable<BreadcrumbItem[]> {
    return this.routerService.current().pipe(
      map(({ query }) => [
        {
          text: query.q
            ? {
                token: 'product.breadcrumb.search-for-<search>',
                values: { search: `"${query.q}"` },
              }
            : { token: 'product.breadcrumb.search' },
        },
      ])
    );
  }
}

export const ProductListBreadcrumb: Provider = {
  provide: `${BreadcrumbResolvers}${RouteType.ProductList}`,
  useClass: ProductListBreadcrumbResolver,
};
