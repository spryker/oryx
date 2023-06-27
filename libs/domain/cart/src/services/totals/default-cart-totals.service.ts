import { Provider, resolve } from "@spryker-oryx/di";
import { TotalsService } from "./totals.service";
import { CartService } from "../cart.service";
import { Observable, map } from "rxjs";
import { CartQualifier, NormalizedTotals } from "../../models";

export class DefaultCartTotalsService implements TotalsService {
  protected cartService = resolve(CartService);

  getTotals(qualifier?: CartQualifier): Observable<NormalizedTotals | null> {
    return this.cartService.getCart(qualifier).pipe(map(
      cart => {
        if (!cart) return null;

        const { totals, currency, discounts, priceMode } = cart;

        return {
          ...(totals ?? {}),
          priceMode,
          currency,
          discounts
        }
      }
    ))
  }
}

export const CartTotalsProvider: Provider = {
  provide: `${TotalsService}CART`,
  useClass: DefaultCartTotalsService,
};
