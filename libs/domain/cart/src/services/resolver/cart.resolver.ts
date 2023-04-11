import {
  ResolvedToken,
  Resolver,
  TokenResourceResolvers,
  BaseResolver
} from '@spryker-oryx/core';
import { Provider, resolve } from '@spryker-oryx/di';
import { map } from 'rxjs';
import { CartService } from '..';

export type CartResolvers = {
  SUMMARY: Resolver;
}

export class CartResolver extends BaseResolver<CartResolvers> {
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
}

export const CartResourceResolver: Provider = {
  provide: `${TokenResourceResolvers}CART`,
  useClass: CartResolver,
};
