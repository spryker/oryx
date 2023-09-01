import { Provider, inject } from '@spryker-oryx/di';
import { RouteType, RouterService } from '@spryker-oryx/router';
import {
  BreadcrumbItem,
  BreadcrumbResolver,
  BreadcrumbResolvers,
} from '@spryker-oryx/site';
import { Observable, map, of } from 'rxjs';

export class ProductDetailsBreadcrumbResolver implements BreadcrumbResolver {
  constructor(protected routerService = inject(RouterService)) {}

  resolve(): Observable<BreadcrumbItem[]> {
    return of([{text: { raw: 'PPProduct' }}]);
  }
}

export const ProductDetailsBreadcrumb: Provider = {
  provide: `${BreadcrumbResolvers}${RouteType.Product}`,
  useClass: ProductDetailsBreadcrumbResolver,
};
