import {
  ContextFallback,
  ContextSerializer,
  ContextService,
} from '@spryker-oryx/core';
import { Provider, inject } from '@spryker-oryx/di';
import { RouteType, RouterService } from '@spryker-oryx/router';
import { featureVersion } from '@spryker-oryx/utilities';
import { Observable, map, of } from 'rxjs';
import { ProductQualifier } from '../models';

export const enum ProductContext {
  SKU = 'sku',
}

export function productContextFallbackFactory(
  router = inject(RouterService),
  context = inject(ContextService)
): Observable<unknown> {
  return router
    .current()
    .pipe(
      map((route) =>
        route.type === RouteType.Product ? route.params : undefined
      )
    );
}

export const ProductContextSerializerToken = `${ContextSerializer}${ProductContext.SKU}`;

export class ProductContextSerializer
  implements ContextSerializer<ProductQualifier>
{
  serialize(value: ProductQualifier): Observable<string> {
    return value?.sku
      ? of(`${value.sku}${value.offer ? `,${value.offer}` : ''}`)
      : of('');
  }

  deserialize(value: string): Observable<ProductQualifier | undefined> {
    const parts = value.split(',');
    return of({
      sku: parts[0],
      ...(parts[1] ? { offer: parts[1] } : {}),
    });
  }
}

/** @deprecated since 1.3, use productContextProviders instead */
export const ProductContextFallback: Provider = {
  provide: `${ContextFallback}${ProductContext.SKU}`,
  useFactory: productContextFallbackFactory,
};

export const productContextProviders: Provider[] =
  featureVersion >= '1.3'
    ? [
        {
          provide: `${ContextFallback}${ProductContext.SKU}`,
          useFactory: productContextFallbackFactory,
        },
        {
          provide: ProductContextSerializerToken,
          useClass: ProductContextSerializer,
        },
      ]
    : [ProductContextFallback];
