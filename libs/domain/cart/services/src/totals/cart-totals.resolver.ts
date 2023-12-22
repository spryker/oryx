import {
  CartContext,
  CartQualifier,
  CartService,
  NormalizedTotals,
  TotalsResolver,
  TotalsResolverOptions,
} from '@spryker-oryx/cart';
import { ContextService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, map, of, switchMap } from 'rxjs';

export class CartTotalsResolver implements TotalsResolver {
  constructor(
    protected cartService = inject(CartService),
    protected contextService = inject(ContextService)
  ) {}

  protected getContext(
    options?: TotalsResolverOptions
  ): Observable<CartQualifier | undefined> {
    return options?.element
      ? this.contextService.get<CartQualifier>(
          options.element,
          CartContext.CartID
        )
      : of(undefined);
  }

  getTotals(
    options?: TotalsResolverOptions
  ): Observable<NormalizedTotals | null> {
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
    );
  }
}
