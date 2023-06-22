// import { Cart, CartDiscount } from '@spryker-oryx/cart';
// import { ContentMixin } from '@spryker-oryx/experience';

// import { asyncState, hydratable, valueType } from '@spryker-oryx/utilities';
// import { html, LitElement, TemplateResult } from 'lit';

// @hydratable('window:load')
// export class OrderTotalsComponent extends OrderMixin(ContentMixin(LitElement)) {
//   @asyncState()
//   protected order = valueType(this.orderController.getOrder());

//   protected buildCart(): Partial<Cart> | null {
//     return this.order
//       ? {
//           name: 'order',
//           priceMode: this.order.priceMode,
//           totals: {
//             ...this.order.totals,
//             priceToPay: this.order.totals.grandTotal,
//           },
//           id: this.order.id,
//           products: this.order.items.map((item) => ({
//             ...item,
//             abstractSku: item.sku,
//             groupKey: '',
//           })),
//           ...(this.order.calculatedDiscounts && {
//             discounts: this.formatDiscounts(this.order.calculatedDiscounts),
//           }),
//         }
//       : null;
//   }

//   protected override render(): TemplateResult {
//     console.log(this.order);
    
//     if (!this.order) {
//       return html``;
//     }
//     return html`<oryx-cart-totals
//       .cart=${this.buildCart()}
//     ></oryx-cart-totals>`;
//   }

//   protected formatDiscounts(
//     discounts: Record<string, OrderDiscount>
//   ): CartDiscount[] {
//     return Object.keys(discounts).map((discount) => ({
//       displayName: discounts[discount].displayName,
//       amount: discounts[discount].sumAmount,
//     }));
//   }
// }

import { ContentMixin } from '@spryker-oryx/experience';
import { computed, hydratable, i18n } from '@spryker-oryx/utilities';
import { OrderMixin } from '../src/mixins';
import { html, LitElement, TemplateResult } from 'lit';
import { TotalsItem, TotalsItemOptions } from './totals-item.model';  
import { SiteSummaryPriceComponentAttributes, PricesBehavior } from '@spryker-oryx/site';

@hydratable('window:load')
export class OrderTotalsItemComponent extends OrderMixin(
  ContentMixin<TotalsItemOptions>(LitElement)
) {
  protected $config = computed(() => {
    if (!this.$order()?.totals ||
    !(this.$options()?.type in this.config)){
      return null;
    }

    return this.config[this.$options().type]!()
  })

  // label?: string | DirectiveResult;
  //   subtext?: string;
  //   value?: number;
  //   currency?: string;
  //   prices?: ChildPrice[];
  //   /**
  //    * @default PricesBehavior.Inline
  //    */
  //   pricesBehavior?: PricesBehavior;

  protected override render(): TemplateResult | void {
    const config =this.$config()
    if (!config) return;

    const {
      label,
      subtext,
      value,
      currency,
      prices,
      pricesBehavior
    } = config;

    return html`<oryx-site-summary-price
      .label=${label}
      .subtext=${subtext}
      .value=${value}
      .currency=${currency}
      .prices=${prices}
      .pricesBehavior=${pricesBehavior}
    ></oryx-site-summary-price>`;
  }

  protected config: Partial<Record<TotalsItem, () => SiteSummaryPriceComponentAttributes>> = {
    [TotalsItem.Subtotal]: (): SiteSummaryPriceComponentAttributes => ({
      label: i18n('order.totals.subtotal'),
      value: this.$order().totals.subtotal,
      currency: this.$order().currencyIsoCode
    })
  }
}
