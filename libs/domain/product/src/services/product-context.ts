import {
  ContextFallback,
  ContextSerializer,
  ContextService,
} from '@spryker-oryx/core';
import { Provider, inject } from '@spryker-oryx/di';
import { RouteType, RouterService } from '@spryker-oryx/router';
import { featureVersion } from '@spryker-oryx/utilities';
import { Observable, map, of } from 'rxjs';
import { PRODUCT } from '../entity';
import { ProductQualifier } from '../models';

declare global {
  interface ContextValue {
    [ProductOldContext.SKU]?: ProductQualifier;
    [PRODUCT]?: ProductQualifier;
  }
}

/** @deprecated since 1.4, use PRODUCT instead */
enum ProductOldContext {
  /** @deprecated since 1.4, use PRODUCT instead */
  SKU = 'sku',
}
enum ProductNewContext {
  SKU = PRODUCT,
}

/** @deprecated since 1.4, use PRODUCT instead */
export const ProductContext =
  featureVersion >= '1.4' ? ProductNewContext : ProductOldContext;

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

export const ProductContextSerializerToken = `${ContextSerializer}${
  featureVersion >= '1.4' ? PRODUCT : ProductContext.SKU
}`;

export class ProductContextSerializer
  implements ContextSerializer<ProductQualifier>
{
  serialize(value: ProductQualifier): Observable<string> {
    return value?.sku ? of(value.sku) : of('');
  }

  deserialize(value: string): Observable<ProductQualifier | undefined> {
    return value
      ? of({
          sku: value,
        })
      : of(undefined);
  }
}

/** @deprecated since 1.3, use productContextProviders instead */
export const ProductContextFallback: Provider = {
  provide: `${ContextFallback}${
    featureVersion >= '1.4' ? PRODUCT : ProductContext.SKU
  }`,
  useFactory: productContextFallbackFactory,
};

export const productContextProviders: Provider[] =
  featureVersion >= '1.3'
    ? [
        {
          provide: `${ContextFallback}${
            featureVersion >= '1.4' ? PRODUCT : ProductContext.SKU
          }`,
          useFactory: productContextFallbackFactory,
        },
        {
          provide: ProductContextSerializerToken,
          useClass: ProductContextSerializer,
        },
      ]
    : [ProductContextFallback];
