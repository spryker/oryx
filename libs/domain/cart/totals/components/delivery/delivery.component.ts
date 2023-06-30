import { hydratable, i18n, signal, signalAware } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { TotalsController } from '../../../src/controllers';

@hydratable('window:load')
@signalAware()
export class CartTotalsDeliveryComponent extends LitElement {
  protected totalsController = new TotalsController(this);

  protected $totals = signal(this.totalsController.getTotals());

  protected override render(): TemplateResult | void {
    const { shipmentTotal, currency } = this.$totals() ?? {};
    if (shipmentTotal !== undefined) {
      return html`
        <span>${i18n('cart.totals.delivery')}</span>
        ${this.renderPrice(shipmentTotal, currency)}
      `;
    } else return this.renderCalculationMessage();
  }

  protected renderPrice(
    value: number,
    currency: string | undefined
  ): TemplateResult {
    if (value === 0)
      return html`<span class="free">${i18n('cart.totals.free')}</span>`;

    return html`<oryx-site-price
      .value=${value}
      .currency=${currency}
    ></oryx-site-price> `;
  }

  protected renderCalculationMessage(): TemplateResult {
    return html`
      <span class="calculation-message"
        >${i18n('cart.totals.delivery-will-be-calculated-at-checkout')}</span
      >
    `;
  }
}
