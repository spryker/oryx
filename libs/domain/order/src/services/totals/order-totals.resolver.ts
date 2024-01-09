import {
  CartDiscount,
  NormalizedTotals,
  PriceMode,
  TotalsResolver,
  TotalsResolverOptions,
} from '@spryker-oryx/cart';
import { ContextService } from '@spryker-oryx/core';
import { Provider, inject } from '@spryker-oryx/di';
import { Observable, map, of, switchMap } from 'rxjs';
import { OrderData, OrderDiscount } from '../../models';
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

  protected getFromContext(
    options?: TotalsResolverOptions
  ): Observable<OrderData | null | void> {
    return this.context
      .get<string>(options?.element ?? null, OrderContext.OrderId)
      .pipe(switchMap((id) => (id ? this.orderService.get({ id }) : of(null))));
  }

  getTotals(
    options?: TotalsResolverOptions
  ): Observable<NormalizedTotals | null> {
    return this.getFromContext(options).pipe(
      map((order) => {
        if (!order) return null;

        const {
          totals,
          currencyIsoCode: currency,
          calculatedDiscounts,
          priceMode,
          shipments,
        } = order;

        return {
          ...totals,
          shipmentTotal:
            shipments?.[0][
              priceMode === PriceMode.GrossMode
                ? 'defaultGrossPrice'
                : 'defaultNetPrice'
            ],
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
