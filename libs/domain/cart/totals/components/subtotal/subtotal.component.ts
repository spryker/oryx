import {
  hydratable,
  I18nMixin,
  signal,
  signalAware,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { TotalsController } from '../../../src/controllers';

@hydratable('window:load')
@signalAware()
export class CartTotalsSubtotalComponent extends I18nMixin(LitElement) {
  protected totalsController = new TotalsController(this);

  protected $totals = signal(this.totalsController.getTotals());

  protected override render(): TemplateResult | void {
    const { subtotal, currency } = this.$totals() ?? {};
    if (subtotal) {
      return html`
        <span>${this.i18n('cart.totals.subtotal')}</span>
        <oryx-site-price
          .value=${subtotal}
          .currency=${currency}
        ></oryx-site-price>
      `;
    }
  }
}
