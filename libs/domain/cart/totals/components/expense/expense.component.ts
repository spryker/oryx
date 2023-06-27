import { hydratable, i18n, signal, signalAware } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { TotalsController } from '../../../src/controllers';

@hydratable('window:load')
@signalAware()
export class CartTotalsExpenseComponent extends LitElement {
  protected totalsController = new TotalsController(this);

  protected $totals = signal(this.totalsController.getFormattedTotals());

  protected override render(): TemplateResult | void {
    const expenseTotal = this.$totals()?.expenseTotal;
    if (expenseTotal) {
      return html`
        <span>${i18n('cart.totals.expense')}</span>
        <span>${expenseTotal}</span>
      `;
    }
  }
}
