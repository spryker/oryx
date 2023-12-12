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
import { GetOrderDataProps } from '../adapter';

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

  protected getFromContext(options?: TotalsResolverOptions): Observable<OrderData | null | void> {
    return this.context.get<string>(
      options?.contextElement ?? null,
      OrderContext.OrderId
    ).pipe(switchMap((id) => (id ? this.orderService.get({ id }) : of(null))));
  }

  getTotals(
    options?: GetOrderDataProps | TotalsResolverOptions
  ): Observable<NormalizedTotals | null> {
    const source = typeof options === 'string'
      ? this.orderService.get(options)
      : this.getFromContext(options as TotalsResolverOptions);
    return source.pipe(
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
