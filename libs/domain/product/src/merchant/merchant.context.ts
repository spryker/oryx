import { ContextFallback, ContextService } from '@spryker-oryx/core';
import { Provider, inject } from '@spryker-oryx/di';
import {
  ProductContext,
  ProductQualifier,
  ProductService,
} from '@spryker-oryx/product';
import { RouterService } from '@spryker-oryx/router';
import { map, of, switchMap } from 'rxjs';

export const enum MerchantContext {
  ID = 'merchant',
}

export const MerchantContextFallback: Provider = {
  provide: `${ContextFallback}${MerchantContext.ID}`,
  useFactory: (
    context = inject(ContextService),
    product = inject(ProductService),
    router = inject(RouterService)
  ) =>
    router.currentParams().pipe(
      switchMap((params) =>
        params?.merchant
          ? of(params?.merchant) // get merchant from merchant url
          : context.get<ProductQualifier>(null, ProductContext.SKU).pipe(
              switchMap((qualifier: ProductQualifier | undefined) =>
                qualifier ? product.get(qualifier) : of(undefined)
              ),
              map((product) => {
                return product?.merchantId;
              })
            )
      )
    ),
};
