import { CartQualifier, CartService } from '@spryker-oryx/cart';
import { BaseResolver, ContextService, ResolvedResult, Resolver, TokenResolverOptions } from '@spryker-oryx/core';
import { inject, resolve } from '@spryker-oryx/di';
import { featureVersion } from '@spryker-oryx/utilities';
import { Observable, map, of, switchMap } from 'rxjs';
import { CartContext } from '../cart-context';

export type CartResolvers = {
  SUMMARY: Resolver;
  EMPTY: Resolver;
};

export class CartResolver extends BaseResolver<CartResolvers> {
  /** @deprecated since 1.1 use cartService instead*/
  protected cartService$ = resolve(CartService);
  protected cartService = inject(CartService);
  protected contextService = inject(ContextService);

  protected getContext(options?: TokenResolverOptions): Observable<CartQualifier | undefined>{
    return featureVersion < '1.4' || !options?.contextElement ?
      of(undefined): 
      this.contextService.get<CartQualifier>(options.contextElement, CartContext.CartID)
  }

  protected resolvers = {
    SUMMARY: (options?: TokenResolverOptions): Observable<ResolvedResult> => {
      return this.getContext(options).pipe(
        switchMap((context) => 
          (featureVersion >= '1.1' ? this.cartService : this.cartService$).getCart(context)
        ),
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
      )
    },
    EMPTY: (options?: TokenResolverOptions): Observable<ResolvedResult> => {
      return this.getContext(options).pipe(
        switchMap((context) => 
          (featureVersion >= '1.1' ? this.cartService : this.cartService$).getCart(context)
        ),
        map((cart) => !cart?.products?.find(({ quantity }) => !!quantity))
      )
    },
  };
}
