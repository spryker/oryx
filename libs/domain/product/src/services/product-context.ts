import { ContextFallback } from '@spryker-oryx/core';
import { inject, Provider } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { map } from 'rxjs';

export const enum ProductContext {
  SKU = 'sku',
}

export const ProductContextFallback: Provider = {
  provide: `${ContextFallback}${ProductContext.SKU}`,
  useFactory: () =>
    inject(RouterService)
      .currentParams()
      .pipe(map((params) => params?.sku)),
};
