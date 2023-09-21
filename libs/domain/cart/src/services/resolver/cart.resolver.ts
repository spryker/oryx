import {
  BaseResolver,
  ResolvedToken,
  Resolver,
  TokenResourceResolvers,
} from '@spryker-oryx/core';
import { Provider, inject, resolve } from '@spryker-oryx/di';
import { featureVersion } from '@spryker-oryx/utilities';
import { map, of } from 'rxjs';
import { CartService } from '..';

export type CartResolvers = {
  SUMMARY: Resolver;
  EMPTY: Resolver;
  TEST: Resolver;
};

export class CartResolver extends BaseResolver<CartResolvers> {
  /** @deprecated since 1.1 use cartService instead*/
  protected cartService$ = resolve(CartService);
  protected cartService = inject(CartService);

  protected resolvers = {
    TEST: (): ResolvedToken => {
      return of(false);
    },
    SUMMARY: (): ResolvedToken => {
      return (featureVersion >= '1.1' ? this.cartService : this.cartService$)
        .getCart()
        .pipe(
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
    EMPTY: (): ResolvedToken => {
      return (featureVersion >= '1.1' ? this.cartService : this.cartService$)
        .getCart()
        .pipe(
          map((cart) => !cart?.products?.find(({ quantity }) => !!quantity))
        );
    },
  };
}

export const CartResourceResolver: Provider = {
  provide: `${TokenResourceResolvers}CART`,
  useClass: CartResolver,
};
