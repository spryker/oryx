import {
  ContextService,
  ElementResolver,
  PageMetaResolver,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { ProductContext } from '../product-context';
import { ProductService } from '../product.service';

export class ProductPageTitleMetaResolver implements PageMetaResolver {
  constructor(
    protected context = inject(ContextService),
    protected router = inject(RouterService),
    protected productService = inject(ProductService)
  ) {}

  getScore(): Observable<unknown[]> {
    return combineLatest([
      this.context.get(document.body, ProductContext.SKU),
      this.router
        .currentRoute()
        .pipe(map((route) => route.includes('product'))),
    ]);
  }

  resolve(): Observable<ElementResolver> {
    return this.context.get(document.body, ProductContext.SKU).pipe(
      switchMap((sku) => {
        if (!sku) {
          return of({});
        }

        return this.productService
          .get({ sku: sku as string })
          .pipe(
            map((product) => (product?.name ? { title: product.name } : {}))
          );
      })
    );
  }
}
