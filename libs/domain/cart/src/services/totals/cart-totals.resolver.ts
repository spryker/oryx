import { inject, Provider } from '@spryker-oryx/di';
import { map, Observable } from 'rxjs';
import { NormalizedTotals } from '../../models';
import { CartService } from '../cart.service';
import { TotalsResolver } from './totals.service';

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

export const CartTotalsProvider: Provider = {
  provide: `${TotalsResolver}CART`,
  useClass: CartTotalsResolver,
};
