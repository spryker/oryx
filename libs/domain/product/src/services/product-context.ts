import { ContextServiceFallback } from '@spryker-oryx/core';
import { inject, Provider } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { map, startWith } from 'rxjs';

export const enum ProductContext {
  SKU = 'sku',
}

export const ProductContextFallback: Provider = {
  provide: `${ContextServiceFallback}${ProductContext.SKU}`,
  useFactory: () =>
    inject(RouterService)
      .currentParams()
      .pipe(
        map((params) => params?.sku),
        startWith(
          ((str) => (str.match(/\/product\/(\w+)/) || [])[1])(
            globalThis.location?.pathname
          )
        )
      ),
};
