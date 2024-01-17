import {
  ContextService,
  ElementResolver,
  PageMetaResolver,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { featureVersion } from '@spryker-oryx/utilities';
import { Observable, combineLatest, map, of, switchMap } from 'rxjs';
import { PRODUCT } from '../../entity';
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
      this.context.get(
        null,
        featureVersion >= '1.4' ? PRODUCT : ProductContext.SKU
      ),
      this.router
        .currentRoute()
        .pipe(map((route) => route.includes('product'))),
    ]);
  }

  resolve(): Observable<ElementResolver> {
    return this.context
      .get(null, featureVersion >= '1.4' ? PRODUCT : ProductContext.SKU)
      .pipe(
        switchMap((qualifier) => {
          if (!qualifier?.sku && !qualifier?.offer) return of({});

          return this.productService
            .get(
              featureVersion >= '1.3' ? qualifier : { sku: qualifier as string }
            )
            .pipe(
              map((product) =>
                product?.description ? { description: product.description } : {}
              )
            );
        })
      );
  }
}
