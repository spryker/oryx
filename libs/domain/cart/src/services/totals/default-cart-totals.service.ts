import { Provider, resolve } from '@spryker-oryx/di';
import { map, Observable } from 'rxjs';
import { CartQualifier, NormalizedTotals } from '../../models';
import { CartService } from '../cart.service';
import { TotalsService } from './totals.service';

export class DefaultCartTotalsService implements TotalsService {
  protected cartService = resolve(CartService);

  getTotals(qualifier?: CartQualifier): Observable<NormalizedTotals | null> {
    return this.cartService.getCart(qualifier).pipe(
      map((cart) => {
        if (!cart?.products?.length) return null;

        const { totals, currency, discounts, priceMode } = cart;

        return {
          ...(totals ?? {}),
          priceMode,
          currency,
          discounts,
        };
      })
    );
  }
}

export const CartTotalsProvider: Provider = {
  provide: `${TotalsService}CART`,
  useClass: DefaultCartTotalsService,
};
