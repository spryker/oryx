import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { hydratable, i18n, signal, signalAware } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { TotalsController } from '../../../src/controllers';
import { PriceMode } from '../../../src/models';
import { CartTotalsTotalOptions } from './total.model';

@defaultOptions({ enableTaxMessage: true })
@hydratable('window:load')
@signalAware()
export class CartTotalsTotalComponent extends ContentMixin<CartTotalsTotalOptions>(
  LitElement
) {
  protected totalsController = new TotalsController(this);

  protected $totals = signal(this.totalsController.getFormattedTotals());

  protected override render(): TemplateResult | void {
    const total = this.$totals()?.priceToPay;
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
