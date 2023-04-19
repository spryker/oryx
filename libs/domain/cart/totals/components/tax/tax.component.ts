import { hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';

import { CartComponentMixin } from '../../../src/mixins/cart.mixin';

@hydratable('window:load')
export class CartTotalsTaxComponent extends CartComponentMixin(LitElement) {
  protected override render(): TemplateResult | void {
    const taxTotal = this.$totals()?.calculations?.taxTotal;
    if (taxTotal) {
      return html`
        <span>${i18n('cart.totals.tax')}</span>
        <span>${taxTotal}</span>
      `;
    }
  }
}
