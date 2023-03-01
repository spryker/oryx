import { Cart, CartDiscount } from '@spryker-oryx/cart';
import { ContentMixin } from '@spryker-oryx/experience';
import { OrderDiscount, OrderMixin } from '@spryker-oryx/order';
import { asyncState, hydratable, valueType } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';

@hydratable('window:load')
export class OrderTotalsComponent extends OrderMixin(ContentMixin(LitElement)) {
  @asyncState()
  protected order = valueType(this.orderController.getOrder());

  protected buildCart(): Partial<Cart> | null {
    return this.order
      ? {
          name: 'order',
          priceMode: this.order.priceMode,
          totals: {
            ...this.order.totals,
            priceToPay: this.order.totals.grandTotal,
          },
          id: this.order.id,
          products: this.order.items.map((item) => ({
            ...item,
            abstractSku: item.sku,
            groupKey: '',
          })),
          ...(this.order.calculatedDiscounts && {
            discounts: this.formatDiscounts(this.order.calculatedDiscounts),
          }),
        }
      : null;
  }

  protected override render(): TemplateResult {
    if (!this.order) {
      return html``;
    }
    return html`<cart-totals .cart=${this.buildCart()}></cart-totals>`;
  }

  protected formatDiscounts(
    discounts: Record<string, OrderDiscount>
  ): CartDiscount[] {
    return Object.keys(discounts).map((discount) => ({
      displayName: discounts[discount].displayName,
      amount: discounts[discount].sumAmount,
    }));
  }
}
