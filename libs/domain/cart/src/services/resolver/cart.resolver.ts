import {
  BaseResolver,
  ResolvedToken,
  Resolver,
  TokenResourceResolvers,
} from '@spryker-oryx/core';
import { INJECTOR, Provider, inject } from '@spryker-oryx/di';
import { map } from 'rxjs';
import { CartService } from '..';

export type CartResolvers = {
  SUMMARY: Resolver;
  EMPTY: Resolver;
};

export class CartResolver extends BaseResolver<CartResolvers> {
  protected cartService: CartService;
  constructor(protected injector = inject(INJECTOR)) {
    super();
    this.cartService = injector.inject(CartService);
  }

  protected resolvers = {
    SUMMARY: (): ResolvedToken => {
      return this.cartService.getCart().pipe(
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
      return this.cartService
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
