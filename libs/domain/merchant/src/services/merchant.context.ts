import {
  ContextFallback,
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
// TODO: resolve merchant context from the element
function merchantContextFallbackFactory(
  router = inject(RouterService),
  context = inject(ContextService),
  product = inject(ProductService)
): Observable<unknown> {
  return router.currentParams().pipe(
    switchMap((params) =>
      params?.merchant
        ? context.deserialize(MerchantContext.ID, params?.merchant as string)
        : context.get<ProductQualifier>(null, ProductContext.SKU).pipe(
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
