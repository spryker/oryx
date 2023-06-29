import { hydratable, i18n, signal, signalAware } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { TotalsController } from '../../../src/controllers';

@hydratable('window:load')
@signalAware()
export class CartTotalsExpenseComponent extends LitElement {
  protected totalsController = new TotalsController(this);

  protected $totals = signal(this.totalsController.getTotals());

  protected override render(): TemplateResult | void {
    const { expenseTotal, currency } = this.$totals() ?? {};
    if (expenseTotal) {
      return html`
        <span>${i18n('cart.totals.expense')}</span>
        <oryx-site-price
          .value=${expenseTotal}
          .currency=${currency}
        ></oryx-site-price>
      `;
    }
  }
}
