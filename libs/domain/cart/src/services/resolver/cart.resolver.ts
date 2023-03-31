import {
  ResolvedToken,
  Resolver,
  TokenResolver,
  TokenResourceResolver,
} from '@spryker-oryx/core';
import { Provider, resolve } from '@spryker-oryx/di';
import { map, of } from 'rxjs';
import { CartService } from '..';

interface CartResolvers {
  SUMMARY: Resolver;
}

export class CartResolver implements TokenResolver {
  protected cartService$ = resolve(CartService);

  protected resolvers = {
    SUMMARY: (): ResolvedToken => {
      return this.cartService$.getCart().pipe(
        map((cart) => {
          const quantity = cart?.products?.reduce(
            (acc, { quantity }) => acc + quantity,
            0
          );

          if (!quantity) {
            return null;
          }

          //TODO: Make max quantity to show configurable
          return quantity > 99 ? '99+' : String(quantity);
        })
      );
    },
  };

  resolve(resolver: string): ResolvedToken {
    if (!(resolver in this.resolvers)) {
      return of(null);
    }
    return this.resolvers[resolver as keyof CartResolvers]();
  }
}

export const CartResourceResolver: Provider = {
  provide: `${TokenResourceResolver}CART`,
  useClass: CartResolver,
};
