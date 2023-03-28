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
    if (!this.totals?.calculations.priceToPay) return;

    const taxMessage = this.componentOptions?.enableTaxMessage
      ? html`<span class="tax-message">
          ${this.totals?.priceMode === PriceMode.GrossMode
            ? i18n('cart.totals.tax-included')
            : i18n('cart.totals.tax-included')}
        </span>`
      : html``;

    return html`
      <span>${i18n('cart.totals.total')}</span>
      <span>${String(this.totals.calculations.priceToPay)}</span>
      ${taxMessage}
    `;
  }
}
