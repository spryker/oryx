import { hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';

import { CartComponentMixin } from '../../../src/mixins/cart.mixin';

@hydratable('window:load')
export class CartTotalsSubtotalComponent extends CartComponentMixin(
  LitElement
) {
  protected override render(): TemplateResult | void {
    if (!this.totals?.calculations.subtotal) return;

    return html`
      <span>${i18n('cart.totals.subtotal')}</span>
      <span>${String(this.totals.calculations.subtotal)}</span>
    `;
  }
}
