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
export class CartTotalsTaxComponent extends I18nMixin(LitElement) {
  protected totalsController = new TotalsController(this);

  protected $totals = signal(this.totalsController.getTotals());

  protected override render(): TemplateResult | void {
    const { taxTotal, currency } = this.$totals() ?? {};
    if (taxTotal) {
      return html`
        <span>${this.i18n('cart.totals.tax')}</span>
        <oryx-site-price
          .value=${taxTotal}
          .currency=${currency}
        ></oryx-site-price>
      `;
    }
  }
}
