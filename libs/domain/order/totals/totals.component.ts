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
import { hydratable, i18n } from '@spryker-oryx/utilities';
import { OrderMixin } from '../src/mixins';
import { html, LitElement, TemplateResult } from 'lit';

@hydratable('window:load')
export class OrderTotalsComponent extends OrderMixin(
  ContentMixin(LitElement)
) {
  protected override render(): TemplateResult | void {
    if (!this.$order()) return;

    return html`<h2>${i18n('order.totals.summary')}</h2>
      <oryx-composition .uid=${this.uid}></oryx-composition>`;
  }
}
