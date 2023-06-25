import { IdentityService } from '@spryker-oryx/auth';
import { PriceMode } from '@spryker-oryx/cart';
import {
  BaseResolver,
  ContextService,
  ResolvedToken,
  Resolver,
  TokenResourceResolvers,
} from '@spryker-oryx/core';
import { Provider, resolve } from '@spryker-oryx/di';
import { NormalizedTotals, TotalPrice, TotalsConfig } from '@spryker-oryx/site';
import { i18n } from '@spryker-oryx/utilities';
import { combineLatest, map, of, shareReplay, switchMap } from 'rxjs';
import { OrderContext, OrderData, OrderDiscount, OrderService } from '../..';

export type OrderResolvers = {
  HAS_TOTALS: Resolver<boolean>;
  SUBTOTAL: Resolver<TotalsConfig>;
  DISCOUNT: Resolver<TotalsConfig>;
  EXPENSE: Resolver<TotalsConfig>;
  TAX: Resolver<TotalsConfig>;
  DELIVERY: Resolver<TotalsConfig>;
  TOTAL: Resolver<TotalsConfig>;
};

export class OrderResolver extends BaseResolver<OrderResolvers> {
  protected context = resolve(ContextService);
  protected identityService = resolve(IdentityService);
  protected orderService = resolve(OrderService);

  protected orderId$ = this.context
    .get<string>(document.body, OrderContext.OrderId)
    .pipe(
      map((id) => id ?? null),
      shareReplay({ refCount: true, bufferSize: 1 })
    );

  protected totals$ = combineLatest([
    this.orderId$,
    this.identityService.get(),
  ]).pipe(
    switchMap(([id, user]) => {
      if (user.isAuthenticated && id) {
        return this.orderService.get({ id });
      }
      return of(null);
    }),
    map((order) => this.normalizeTotals(order)),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  protected normalizeDiscounts(
    discounts: Record<string, OrderDiscount>,
    currency: string
  ): TotalPrice[] | undefined {
    if (!discounts) return;
    return Object.keys(discounts).map((key) => ({
      label: discounts[key].displayName,
      value: discounts[key].sumAmount,
      currency,
    }));
  }

  protected normalizeTotals(order: OrderData | null): NormalizedTotals | null {
    if (!order) return {};

    const {
      totals,
      priceMode,
      currencyIsoCode: currency,
      calculatedDiscounts,
    } = order;

    return {
      ...totals,
      priceMode,
      currency,
      ...(calculatedDiscounts
        ? { discounts: this.normalizeDiscounts(calculatedDiscounts, currency) }
        : {}),
    };
  }

  protected hasValue(value?: number): boolean {
    return typeof value !== 'undefined';
  }

  protected resolvers = {
    HAS_TOTALS: (): ResolvedToken<boolean> => {
      return this.totals$.pipe(map((totals) => !!totals));
    },
    SUBTOTAL: (): ResolvedToken<TotalsConfig> => {
      return this.totals$.pipe(
        map((totals) => {
          const { currency, subtotal } = totals ?? {};

          return this.hasValue(subtotal)
            ? {
                label: i18n('site.totals.subtotal'),
                value: subtotal,
                currency,
              }
            : null;
        })
      );
    },
    DISCOUNT: (): ResolvedToken<TotalsConfig> => {
      return this.totals$.pipe(
        map((totals) => {
          const { discountTotal, discounts, currency } = totals ?? {};

          return this.hasValue(discountTotal)
            ? {
                label: i18n('site.totals.<count>-discounts', {
                  count: discounts?.length,
                }),
                value: discountTotal,
                currency,
                prices: discounts,
              }
            : null;
        })
      );
    },
    EXPENSE: (): ResolvedToken<TotalsConfig> => {
      return this.totals$.pipe(
        map((totals) => {
          const { expenseTotal, currency } = totals ?? {};

          return this.hasValue(expenseTotal)
            ? {
                label: i18n('site.totals.expense'),
                value: expenseTotal,
                currency,
              }
            : null;
        })
      );
    },
    TAX: (): ResolvedToken<TotalsConfig> => {
      return this.totals$.pipe(
        map((totals) => {
          const { taxTotal, currency } = totals ?? {};

          return this.hasValue(taxTotal)
            ? {
                label: i18n('site.totals.tax'),
                value: taxTotal,
                currency,
              }
            : null;
        })
      );
    },
    DELIVERY: (): ResolvedToken<TotalsConfig> => {
      return this.totals$.pipe(
        map(() => {
          return {
            label: i18n('site.totals.delivery'),
            value: 'Not implemented yet',
          };
        })
      );
    },
    TOTAL: (): ResolvedToken<TotalsConfig> => {
      return this.totals$.pipe(
        map((totals) => {
          const { grandTotal, currency, priceMode } = totals ?? {};

          return this.hasValue(grandTotal)
            ? {
                label: i18n('order.totals.total'),
                value: grandTotal,
                currency,
                subtext: i18n(
                  priceMode === PriceMode.GrossMode
                    ? 'site.totals.tax-included'
                    : 'site.totals.tax-excluded'
                ),
                accented: true,
                delimiter: true,
              }
            : null;
        })
      );
    },
  };
}

export const OrderResourceResolver: Provider = {
  provide: `${TokenResourceResolvers}ORDER`,
  useClass: OrderResolver,
};
