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
import { MERCHANT } from '../entity';
import { MerchantQualifier } from '../models';

function merchantContextFallbackFactory(
  router = inject(RouterService),
  context = inject(ContextService),
  product = inject(ProductService)
): ContextFallbackHandler<MerchantQualifier | undefined> {
  return ({ element }) =>
    router.current().pipe(
      switchMap((route) =>
        route.type === MERCHANT
          ? of(route.params)
          : context.get(element, ProductContext.SKU).pipe(
              switchMap((qualifier: ProductQualifier | undefined) =>
                qualifier ? product.get(qualifier) : of(undefined)
              ),
              switchMap(
                (product) =>
                  context.deserialize(
                    MerchantContext.ID,
                    product?.merchantId as string
                  ) as Observable<MerchantQualifier | undefined>
              )
            )
      )
    );
}

export const MerchantContextSerializerToken = `${ContextSerializer}${MERCHANT}`;

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
    provide: `${ContextFallback}${MERCHANT}`,
    useFactory: merchantContextFallbackFactory,
  },
  {
    provide: MerchantContextSerializerToken,
    useClass: MerchantContextSerializer,
  },
];
