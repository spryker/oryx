import { CartService } from '@spryker-oryx/cart';
import { BaseResolver, ResolvedResult, Resolver } from '@spryker-oryx/core';
import { inject, resolve } from '@spryker-oryx/di';
import { featureVersion } from '@spryker-oryx/utilities';
import { Observable, map } from 'rxjs';

export type CartResolvers = {
  SUMMARY: Resolver;
  EMPTY: Resolver;
};

export class CartResolver extends BaseResolver<CartResolvers> {
  /** @deprecated since 1.1 use cartService instead*/
  protected cartService$ = resolve(CartService);
  protected cartService = inject(CartService);

  protected resolvers = {
    SUMMARY: (): Observable<ResolvedResult> => {
      return (featureVersion >= '1.1' ? this.cartService : this.cartService$)
        .getCart()
        .pipe(
          map((cart) => {
            const quantity = cart?.products?.reduce(
              (acc, { quantity }) => acc + Number(quantity),
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
    EMPTY: (): Observable<ResolvedResult> => {
      return (featureVersion >= '1.1' ? this.cartService : this.cartService$)
        .getCart()
        .pipe(
          map((cart) => !cart?.products?.find(({ quantity }) => !!quantity))
        );
    },
  };
}
