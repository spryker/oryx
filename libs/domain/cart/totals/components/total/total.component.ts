import { PriceMode } from '@spryker-oryx/cart';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';

import { CartComponentMixin } from '../../../src/mixins/cart.mixin';
import { CartTotalsTotalOptions } from './total.model';

@defaultOptions({ enableTaxMessage: true })
@hydratable('window:load')
export class CartTotalsTotalComponent extends CartComponentMixin(
  ContentMixin<CartTotalsTotalOptions>(LitElement)
) {
  protected override render(): TemplateResult | void {
    const total = this.$totals()?.calculations?.priceToPay;
    if (total) {
      return html`
        <span>${i18n('cart.totals.total')}</span>
        <span>${total}</span>
        ${this.renderTaxMessage()}
      `;
    }
  }

  protected renderTaxMessage(): TemplateResult | void {
    if (this.$options().enableTaxMessage) {
      return html`<span class="tax-message">
        ${this.$totals()?.priceMode === PriceMode.GrossMode
          ? i18n('cart.totals.tax-included')
          : i18n('cart.totals.tax-excluded')}
      </span>`;
    }
  }
}
