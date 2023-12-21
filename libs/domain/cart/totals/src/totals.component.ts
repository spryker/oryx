import { ContentMixin } from '@spryker-oryx/experience';
import { hydrate, signal, signalAware } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { TotalsController } from '../../src/controllers';

@hydrate({ event: 'window:load' })
@signalAware()
export class CartTotalsComponent extends ContentMixin(LitElement) {
  protected totalsController = new TotalsController(this);

  protected $totals = signal(this.totalsController.getTotals());

  protected override render(): TemplateResult | void {
    if (this.$totals()) {
      return html`<h2>${this.i18n('cart.totals.summary')}</h2>
        <oryx-composition .uid=${this.uid}></oryx-composition> `;
    }
  }
}
