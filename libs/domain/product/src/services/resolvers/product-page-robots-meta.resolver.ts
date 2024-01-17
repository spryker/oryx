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
 * product is discontinued and no longer has stock available, the robots meta
 * tag will be set to `noindex,follow`. Otherwise, the robots meta tag will be
 * set to `index,follow`.
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
        if (!qualifier?.sku && !qualifier?.offer) return of({});

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
    return !!product?.discontinued && !product.availability?.quantity;
  }
}
