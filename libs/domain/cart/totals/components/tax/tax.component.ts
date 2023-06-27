import { hydratable, i18n, signal, signalAware } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { TotalsController } from '../../../src/controllers';

@hydratable('window:load')
@signalAware()
export class CartTotalsTaxComponent extends LitElement {
  protected totalsController = new TotalsController(this);

  protected $totals = signal(this.totalsController.getTotals());

  protected override render(): TemplateResult | void {
    const { taxTotal, currency } = this.$totals() ?? {};
    if (taxTotal) {
      return html`
        <span>${i18n('cart.totals.tax')}</span>
        <oryx-site-price
          .value=${taxTotal}
          .currency=${currency}
        ></oryx-site-price>
      `;
    }
  }
}
