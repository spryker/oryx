import { CartComponentMixin } from '@spryker-oryx/cart';
import { hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';

@hydratable('window:load')
export class CartTotalsDeliveryComponent extends CartComponentMixin(
  LitElement
) {
  protected override render(): TemplateResult | void {
    if (this.$totals()) {
      return html`
        <span>${i18n('cart.totals.delivery')}</span>
        <span>Not implemented yet</span>
      `;
    }
  }
}
