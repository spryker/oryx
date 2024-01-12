import {
  ContextFallback,
  ContextFallbackHandler,
  ContextSerializer,
  ContextService,
  FieldContextSerializer,
} from '@spryker-oryx/core';
import { Provider, inject } from '@spryker-oryx/di';
import {
  PRODUCT,
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
          : context.get(element, PRODUCT).pipe(
              switchMap((qualifier: ProductQualifier | undefined) =>
                qualifier ? product.get(qualifier) : of(undefined)
              ),
              switchMap(
                (product) =>
                  context.deserialize(
                    MERCHANT,
                    product?.merchantId as string
                  ) as Observable<MerchantQualifier | undefined>
              )
            )
      )
    );
}

export const MerchantContextSerializerToken = `${ContextSerializer}${MERCHANT}`;

export const merchantContextProviders: Provider[] = [
  {
    provide: `${ContextFallback}${MERCHANT}`,
    useFactory: merchantContextFallbackFactory,
  },
  {
    provide: MerchantContextSerializerToken,
    useClass: FieldContextSerializer,
  },
];
