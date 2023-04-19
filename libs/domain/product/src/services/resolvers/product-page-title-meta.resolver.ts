import {
  ContextService,
  ElementResolver,
  PageMetaResolver,
  ResolverScore,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { map, Observable, of, switchMap } from 'rxjs';
import { ProductContext } from '../product-context';
import { ProductService } from '../product.service';

export class ProductPageTitleMetaResolver implements PageMetaResolver {
  constructor(
    protected context = inject(ContextService),
    protected productService = inject(ProductService)
  ) {}

  getScore(): Observable<number> {
    return this.context
      .get(document.body, ProductContext.SKU)
      .pipe(
        map((sku) => (sku ? ResolverScore.Default : ResolverScore.NotUsed))
      );
  }

  resolve(): Observable<ElementResolver> {
    return this.context.get(document.body, ProductContext.SKU).pipe(
      switchMap((sku) => {
        if (!sku) {
          return of({});
        }

        return this.productService
          .get({ sku: sku as string })
          .pipe(map((product) => ({ title: product?.name })));
      })
    );
  }
}
