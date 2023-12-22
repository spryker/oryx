import { CART, CartQualifier } from '@spryker-oryx/cart';
import {
  ContextFallback,
  ContextSerializer,
  ContextService,
} from '@spryker-oryx/core';
import { Provider, inject } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { Observable, of, switchMap } from 'rxjs';

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

export class CartContextSerializer implements ContextSerializer<CartQualifier> {
  serialize(value: CartQualifier): Observable<string> {
    return of(value?.cartId ?? '');
  }

  deserialize(cartId: string): Observable<CartQualifier | undefined> {
    return of(cartId ? { cartId } : undefined);
  }
}

export const cartContextProviders: Provider[] = [
  {
    provide: `${ContextFallback}${CART}`,
    useFactory: cartContextFallbackFactory,
  },
  {
    provide: CartContextSerializerToken,
    useClass: CartContextSerializer,
  },
];
