import {
  ContextService,
  ElementResolver,
  PageMetaResolver,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { Observable, combineLatest, map, of, switchMap } from 'rxjs';
import { PRODUCT } from '../../entity';
import { Product } from '../../models';
import { ProductService } from '../product.service';

/**
 * Meta resolver to generate the robots meta tag for the product page. When the
 * product is available, the meta tag will be set to 'follow, index', otherwise
 * it will be set to 'follow, noindex'.
 */
export class ProductPageRobotMetaResolver implements PageMetaResolver {
  constructor(
    protected context = inject(ContextService),
    protected router = inject(RouterService),
    protected productService = inject(ProductService)
  ) {}

  getScore(): Observable<unknown[]> {
    return combineLatest([
      this.context.get(null, PRODUCT),
      this.router
        .currentRoute()
        .pipe(map((route) => route.includes('product'))),
    ]);
  }

  resolve(): Observable<ElementResolver> {
    return this.context.get(null, PRODUCT).pipe(
      switchMap((qualifier) => {
        if (!qualifier) {
          return of({});
        }
        return this.productService.get(qualifier).pipe(
          map((product) => ({
            robots: this.isDiscontinued(product)
              ? 'noindex,follow'
              : 'index,follow',
          }))
        );
      })
    );
  }

  protected isDiscontinued(product?: Product): boolean {
    return !!product?.discontinued;
  }
}
