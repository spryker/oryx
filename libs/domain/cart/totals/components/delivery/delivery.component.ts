import {
  hydratable,
  I18nMixin,
  signal,
  signalAware,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { TotalsController } from '../../../src/controllers';

@hydratable({ event: 'window:load' })
@signalAware()
export class CartTotalsDeliveryComponent extends I18nMixin(LitElement) {
  protected totalsController = new TotalsController(this);

  protected $totals = signal(this.totalsController.getTotals());

  protected override render(): TemplateResult | void {
    const { shipmentTotal, currency } = this.$totals() ?? {};
    if (shipmentTotal !== undefined) {
      return html`
        <span>${this.i18n('cart.totals.delivery')}</span>
        ${this.renderPrice(shipmentTotal, currency)}
      `;
    } else return this.renderUnknownMessage();
  }

  protected renderPrice(
    value: number,
    currency: string | undefined
  ): TemplateResult {
    if (value === 0)
      return html`<span class="free">${this.i18n('cart.totals.free')}</span>`;

    return html`<oryx-site-price
      .value=${value}
      .currency=${currency}
    ></oryx-site-price> `;
  }

  protected renderUnknownMessage(): TemplateResult {
    return html`
      <span class="unknown-message"
        >${this.i18n('cart.totals.unknown-delivery-cost')}</span
      >
    `;
  }
}
