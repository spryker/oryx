import { resolve } from '@spryker-oryx/di';
import { PricingService } from '@spryker-oryx/site';
import { hydratable, i18n, signal, signalAware } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { TotalsController } from '../../../src/controllers';

@hydratable('window:load')
@signalAware()
export class CartTotalsSubtotalComponent extends LitElement {
  protected pricingService = resolve(PricingService);
  protected totalsController = new TotalsController(this);

  protected $totals = signal(this.totalsController.getFormattedTotals());

  protected override render(): TemplateResult | void {
    const subtotal = this.$totals()?.subtotal;
    if (subtotal) {
      return html`
        <span>${i18n('cart.totals.subtotal')}</span>
        <span>${subtotal}</span>
      `;
    }
  }
}
