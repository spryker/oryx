import {
  CartQualifier,
  CartService,
  NormalizedTotals,
  TotalsResolver,
  TotalsResolverOptions,
} from '@spryker-oryx/cart';
import { inject } from '@spryker-oryx/di';
import { featureVersion } from '@spryker-oryx/utilities';
import { Observable, map, of, switchMap } from 'rxjs';
import { CartContext } from '../cart-context';
import { ContextService } from '@spryker-oryx/core';

export class CartTotalsResolver implements TotalsResolver {
  constructor(
    protected cartService = inject(CartService),
    protected contextService = inject(ContextService)
  ) {}

  protected getContext(options?: TotalsResolverOptions): Observable<CartQualifier | undefined>{
    return featureVersion < '1.4' || !options?.contextElement ?
      of(undefined): 
      this.contextService.get<CartQualifier>(options.contextElement, CartContext.CartID)
  }

  getTotals(options?: TotalsResolverOptions): Observable<NormalizedTotals | null> {
    return this.getContext(options).pipe(
      switchMap((context) => this.cartService.getCart(context)),
      map((cart) => {
        if (!cart?.products?.length) return null;

        const { totals, currency, discounts, priceMode } = cart;

        return {
          ...totals,
          priceMode,
          currency,
          discounts,
        };
      })
    )
  }
}
