import { PriceMode } from '@spryker-oryx/cart';
import { ContentMixin } from '@spryker-oryx/experience';
import {
  SiteSummaryPriceComponentAttributes,
  TotalPrice,
} from '@spryker-oryx/site';
import { computed, hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { OrderMixin } from '../src/mixins';
import { OrderData, OrderDiscount } from '../src/models';
import { TotalsItem, TotalsItemOptions } from './totals-item.model';

interface NormalizedTotals {
  currency?: string;
  subtotal?: number;
  total?: number;
  taxTotal?: number;
  expenseTotal?: number;
  grandTotal?: number;
  canceledTotal?: number;
  remunerationTotal?: number;
  priceMode?: string;
  discountTotal?: number;
  discounts?: TotalPrice[];
}

@hydratable('window:load')
export class OrderTotalsItemComponent extends OrderMixin(
  ContentMixin<TotalsItemOptions>(LitElement)
) {
  protected $totals = computed(() => this.normalizeTotals(this.$order()));

  protected $config = computed(() => {
    const totals = this.$totals();
    if (!totals || !this.$options()?.type) {
      return null;
    }

    return this.getConfig(totals, this.$options().type);
  });

  protected override render(): TemplateResult | void {
    const config = this.$config();
    if (!config) return;

    const {
      label,
      subtext,
      value,
      currency,
      prices,
      pricesBehavior,
      accented,
      delimiter,
    } = config;

    return html`<oryx-site-summary-price
      .label=${label}
      .subtext=${subtext}
      .value=${value}
      .currency=${currency}
      .prices=${prices}
      .pricesBehavior=${pricesBehavior}
      ?delimiter=${delimiter}
      ?accented=${accented}
    ></oryx-site-summary-price>`;
  }

  protected getConfig(
    totals: NormalizedTotals,
    type: TotalsItem
  ): SiteSummaryPriceComponentAttributes | null {
    const {
      currency,
      subtotal,
      total,
      taxTotal,
      expenseTotal,
      grandTotal,
      canceledTotal,
      remunerationTotal,
      priceMode,
      discountTotal,
      discounts,
    } = totals;
    const { discountRowsAppearance, enableTaxMessage } = this.$options();

    switch (type) {
      case TotalsItem.Subtotal:
        return this.hasValue(subtotal)
          ? {
              label: i18n('order.totals.subtotal'),
              value: subtotal,
              currency,
            }
          : null;
      case TotalsItem.Discount:
        return this.hasValue(discountTotal)
          ? {
              label: i18n('order.totals.<count>-discounts', {
                count: discounts?.length,
              }),
              value: discountTotal,
              currency,
              prices: discounts,
              ...(discountRowsAppearance
                ? { pricesBehavior: discountRowsAppearance }
                : {}),
            }
          : null;
      case TotalsItem.Expense:
        return this.hasValue(expenseTotal)
          ? {
              label: i18n('order.totals.expense'),
              value: expenseTotal,
              currency,
            }
          : null;
      case TotalsItem.Tax:
        return this.hasValue(taxTotal)
          ? {
              label: i18n('order.totals.tax'),
              value: taxTotal,
              currency,
            }
          : null;
      case TotalsItem.Delivery:
        return {
          label: i18n('order.totals.delivery'),
          value: 'Not implemented yet',
        };
      case TotalsItem.Total:
        return this.hasValue(taxTotal)
          ? {
              label: i18n('order.totals.total'),
              value: grandTotal,
              currency,
              ...(enableTaxMessage
                ? {
                    subtext: i18n(
                      //TODO: organize models
                      priceMode === PriceMode.GrossMode
                        ? 'order.totals.tax-included'
                        : 'order.totals.tax-excluded'
                    ),
                  }
                : {}),
              accented: true,
              delimiter: true,
            }
          : null;
      default:
        return null;
    }
  }

  protected hasValue(value?: number): boolean {
    return typeof value !== 'undefined';
  }

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

  protected normalizeTotals(order: OrderData): NormalizedTotals | null {
    if (!order) return null;

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
}
