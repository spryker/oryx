import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { hydrate, signal, signalAware } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { TotalsController } from '../../../../src/controllers';
import { PriceMode } from '../../../../src/models';
import { CartTotalsTotalOptions } from './total.model';

@defaultOptions({ enableTaxMessage: true })
@hydrate({ event: 'window:load' })
@signalAware()
export class CartTotalsTotalComponent extends ContentMixin<CartTotalsTotalOptions>(
  LitElement
) {
  protected totalsController = new TotalsController(this);

  protected $totals = signal(this.totalsController.getTotals());

  protected override render(): TemplateResult | void {
    const { priceToPay, currency } = this.$totals() ?? {};
    if (priceToPay) {
      return html`
        <span>${this.i18n('cart.totals.total')}</span>
        <oryx-site-price
          .value=${priceToPay}
          .currency=${currency}
        ></oryx-site-price>
        ${this.renderTaxMessage()}
      `;
    }
  }

  protected renderTaxMessage(): TemplateResult | void {
    if (this.$options().enableTaxMessage) {
      return html`<span class="tax-message">
        ${this.$totals()?.priceMode === PriceMode.GrossMode
          ? this.i18n('cart.totals.tax-included')
          : this.i18n('cart.totals.tax-excluded')}
      </span>`;
    }
  }
}
