import { ContextFallback, ContextService } from '@spryker-oryx/core';
import { Provider, inject } from '@spryker-oryx/di';
import { ProductContext, ProductService } from '@spryker-oryx/product';
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
          : context.get(null, ProductContext.SKU).pipe(
              // get merchant from product sku
              switchMap((sku) => {
                // TODO: context will give us the whole qualifier with context serializers
                const sku_context = ((sku ?? '') as string)?.split(',');
                const qualifier = {
                  sku: sku_context[0],
                  ...(sku_context[1] ? { offer: sku_context[1] } : {}),
                };
                return product.get(qualifier);
              }),
              map((product) => {
                return product?.merchantId;
              })
            )
      )
    ),
};
