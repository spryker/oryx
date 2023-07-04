import {
  CartDiscount,
  NormalizedTotals,
  TotalsResolver,
} from '@spryker-oryx/cart';
import { ContextService } from '@spryker-oryx/core';
import { inject, Provider } from '@spryker-oryx/di';
import { map, Observable, of, switchMap } from 'rxjs';
import { OrderData, OrderDiscount } from '../../models';
import { GetOrderDataProps } from '../adapter';
import { OrderContext } from '../order-context';
import { OrderService } from '../order.service';

export class OrderTotalsResolver implements TotalsResolver {
  constructor(
    protected orderService = inject(OrderService),
    protected context = inject(ContextService)
  ) {}

  protected formatDiscounts(
    discounts: Record<string, OrderDiscount>
  ): CartDiscount[] {
    return Object.keys(discounts).map((discount) => ({
      displayName: discounts[discount].displayName,
      amount: discounts[discount].sumAmount,
    }));
  }

  protected getFromContext(): Observable<OrderData | null> {
    return this.context
      .get<string>(
        null /* for now we are happy with global/fallback orderId */,
        OrderContext.OrderId
      )
      .pipe(switchMap((id) => (id ? this.orderService.get({ id }) : of(null))));
  }

  getTotals(
    qualifier?: GetOrderDataProps
  ): Observable<NormalizedTotals | null> {
    const source = qualifier
      ? this.orderService.get(qualifier)
      : this.getFromContext();
    return source.pipe(
      map((order) => {
        if (!order) return null;

        const {
          totals,
          currencyIsoCode: currency,
          calculatedDiscounts,
          priceMode,
        } = order;

        return {
          ...totals,
          priceToPay: totals.grandTotal,
          priceMode,
          currency,
          ...(calculatedDiscounts
            ? { discounts: this.formatDiscounts(calculatedDiscounts) }
            : {}),
        };
      })
    );
  }
}

export const OrderTotalsProvider: Provider = {
  provide: `${TotalsResolver}ORDER`,
  useClass: OrderTotalsResolver,
};
