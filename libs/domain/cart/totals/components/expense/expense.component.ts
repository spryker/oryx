import { hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';

import { CartComponentMixin } from '../../../src/mixins/cart.mixin';

@hydratable('window:load')
export class CartTotalsExpenseComponent extends CartComponentMixin(LitElement) {
  protected override render(): TemplateResult | void {
    const expenseTotal = this.$totals()?.calculations?.expenseTotal;
    if (expenseTotal) {
      return html`
        <span>${i18n('cart.totals.expense')}</span>
        <span>${expenseTotal}</span>
      `;
    }
  }
}
