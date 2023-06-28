import { Provider, resolve } from '@spryker-oryx/di';
import { map, Observable } from 'rxjs';
import { NormalizedTotals } from '../../models';
import { CartService } from '../cart.service';
import { TotalsServiceProvider } from './totals.service';

export class DefaultCartTotalsService implements TotalsServiceProvider {
  protected cartService = resolve(CartService);

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
  provide: `${TotalsServiceProvider}CART`,
  useClass: DefaultCartTotalsService,
};
