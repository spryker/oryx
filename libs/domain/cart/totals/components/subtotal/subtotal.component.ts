import { hydratable, i18n, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';

import { CartComponentMixin } from '../../../src/mixins/cart.mixin';
import { TotalsController } from '@spryker-oryx/cart';

@hydratable('window:load')
export class CartTotalsSubtotalComponent extends CartComponentMixin(
  LitElement
) {
  protected totalsController = new TotalsController(this);

  protected $t = signal(this.totalsController.getTotals());

  protected override render(): TemplateResult | void {
    console.log(this.$t());
    
    const subtotal = this.$totals()?.calculations?.subtotal;
    if (subtotal) {
      return html`
        <span>${i18n('cart.totals.subtotal')}</span>
        <span>${subtotal}</span>
      `;
    }
  }
}
