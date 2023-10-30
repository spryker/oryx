import {
  CartService,
  NormalizedTotals,
  TotalsResolver,
} from '@spryker-oryx/cart';
import { inject } from '@spryker-oryx/di';
import { Observable, map } from 'rxjs';

export class CartTotalsResolver implements TotalsResolver {
  constructor(protected cartService = inject(CartService)) {}

  getTotals(): Observable<NormalizedTotals | null> {
    return this.cartService.getCart().pipe(
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
