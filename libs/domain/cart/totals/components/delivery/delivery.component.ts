import { CartComponentMixin } from '@spryker-oryx/cart';
import { Size } from '@spryker-oryx/ui';
import { hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';

@hydratable('window:load')
export class CartTotalsDeliveryComponent extends CartComponentMixin(
  LitElement
) {
  protected override render(): TemplateResult | void {
    if (!this.totals?.calculations) return;

    return html`
      <span>${i18n('cart.totals.delivery')}</span>
      <span>
        Not implemented yet
        <oryx-icon-button size=${Size.Sm}>
          <a href="#" title=${i18n('cart.totals.delivery-message')}>
            <oryx-icon type="info"></oryx-icon>
          </a> </oryx-icon-button
      ></span>
    `;
  }
}
