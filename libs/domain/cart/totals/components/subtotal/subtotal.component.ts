import { hydratable, i18n, signal, signalAware } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { TotalsController } from '../../../src/controllers';

@hydratable('window:load')
@signalAware()
export class CartTotalsSubtotalComponent extends LitElement {
  protected totalsController = new TotalsController(this);

  protected $totals = signal(this.totalsController.getTotals());

  protected override render(): TemplateResult | void {
    const { subtotal, currency } = this.$totals() ?? {};
    if (subtotal) {
      return html`
        <span>${i18n('cart.totals.subtotal')}</span>
        <oryx-site-price
          .value=${subtotal}
          .currency=${currency}
        ></oryx-site-price>
      `;
    }
  }
}
