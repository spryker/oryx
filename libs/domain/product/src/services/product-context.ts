import { ContextFallback, ContextService } from '@spryker-oryx/core';
import { Provider, inject } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { Observable, switchMap } from 'rxjs';

export const enum ProductContext {
  SKU = 'sku',
}

export function productContextFallbackFactory(
  router = inject(RouterService),
  context = inject(ContextService)
): Observable<unknown> {
  return router
    .currentParams()
    .pipe(
      switchMap((params) =>
        context.deserialize(ProductContext.SKU, (params?.sku as string) ?? '')
      )
    );
}

export const ProductContextFallback: Provider = {
  provide: `${ContextFallback}${ProductContext.SKU}`,
  useFactory: productContextFallbackFactory,
};
