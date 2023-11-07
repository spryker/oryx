import {
  ContextService,
  ElementResolver,
  PageMetaResolver,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { Observable, combineLatest, map, of, switchMap } from 'rxjs';
import { ProductContext } from '../product-context';
import { ProductService } from '../product.service';

export class ProductPageDescriptionMetaResolver implements PageMetaResolver {
  constructor(
    protected context = inject(ContextService),
    protected router = inject(RouterService),
    protected productService = inject(ProductService)
  ) {}

  getScore(): Observable<unknown[]> {
    return combineLatest([
      this.context.get(null, ProductContext.SKU),
      this.router
        .currentRoute()
        .pipe(map((route) => route.includes('product'))),
    ]);
  }

  resolve(): Observable<ElementResolver> {
    return this.context.get(null, ProductContext.SKU).pipe(
      switchMap((qualifier) => {
        if (!qualifier) {
          return of({});
        }

        return this.productService
          .get(qualifier)
          .pipe(
            map((product) =>
              product?.description ? { description: product.description } : {}
            )
          );
      })
    );
  }
}
