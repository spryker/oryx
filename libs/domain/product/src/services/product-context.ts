import {
  ContextFallback,
  ContextSerializer,
  ContextService,
} from '@spryker-oryx/core';
import { Provider, inject } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { Observable, of, switchMap } from 'rxjs';
import { ProductQualifier } from '../models';

export const enum ProductContext {
  SKU = 'sku',
}

export function productContextFallbackFactory(
  router = inject(RouterService),
  context = inject(ContextService)
) {
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

export const ProductContextSerializerToken = `${ContextSerializer}${ProductContext.SKU}`;

export class ProductContextSerializer
  implements ContextSerializer<ProductQualifier>
{
  serialize(value: ProductQualifier | string): Observable<string> {
    if (typeof value === 'string') return of(value);

    return value.sku
      ? of(`${value.sku}${value.offer ? `,${value.offer}` : ''}`)
      : of('');
  }

  deserialize(value: string): Observable<ProductQualifier> {
    const parts = value.split(',');
    return of({
      sku: parts[0],
      ...(parts[1] ? { offer: parts[1] } : {}),
    });
  }
}
