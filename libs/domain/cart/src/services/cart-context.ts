import {
  ContextFallback,
  ContextSerializer,
  ContextService,
  FieldContextSerializer,
} from '@spryker-oryx/core';
import { Provider, inject } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { Observable, switchMap } from 'rxjs';
import { CART } from '../entity';

export function cartContextFallbackFactory(
  router = inject(RouterService),
  context = inject(ContextService)
): Observable<unknown> {
  return router
    .currentParams()
    .pipe(
      switchMap((params) =>
        context.deserialize(CART, (params?.cartId as string) ?? '')
      )
    );
}

export const CartContextSerializerToken = `${ContextSerializer}${CART}`;

export const cartContextProviders: Provider[] = [
  {
    provide: `${ContextFallback}${CART}`,
    useFactory: cartContextFallbackFactory,
  },
  {
    provide: CartContextSerializerToken,
    useFactory: () => new FieldContextSerializer('cartId'),
  },
];
