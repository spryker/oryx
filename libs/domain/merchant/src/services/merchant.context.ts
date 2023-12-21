import {
  ContextFallback,
  ContextFallbackHandler,
  ContextSerializer,
  ContextService,
} from '@spryker-oryx/core';
import { Provider, inject } from '@spryker-oryx/di';
import {
  ProductContext,
  ProductQualifier,
  ProductService,
} from '@spryker-oryx/product';
import { RouterService } from '@spryker-oryx/router';
import { Observable, of, switchMap } from 'rxjs';
import { MerchantQualifier } from '../models';

export const enum MerchantContext {
  ID = 'merchant',
}

function merchantContextFallbackFactory(
  router = inject(RouterService),
  context = inject(ContextService),
  product = inject(ProductService)
): ContextFallbackHandler<unknown> {
  return ({ element }) =>
    router.current().pipe(
      switchMap((route) =>
        route.type === 'merchant'
          ? of(route.params)
          : context.get<ProductQualifier>(element, ProductContext.SKU).pipe(
              switchMap((qualifier: ProductQualifier | undefined) =>
                qualifier ? product.get(qualifier) : of(undefined)
              ),
              switchMap((product) =>
                context.deserialize(
                  MerchantContext.ID,
                  product?.merchantId as string
                )
              )
            )
      )
    );
}

export const MerchantContextSerializerToken = `${ContextSerializer}${MerchantContext.ID}`;

export class MerchantContextSerializer
  implements ContextSerializer<MerchantQualifier>
{
  serialize(value: MerchantQualifier): Observable<string> {
    return value?.id ? of(value.id) : of('');
  }

  deserialize(value: string): Observable<MerchantQualifier | undefined> {
    return of({ id: value });
  }
}

export const merchantContextProviders: Provider[] = [
  {
    provide: `${ContextFallback}${MerchantContext.ID}`,
    useFactory: merchantContextFallbackFactory,
  },
  {
    provide: MerchantContextSerializerToken,
    useClass: MerchantContextSerializer,
  },
];
