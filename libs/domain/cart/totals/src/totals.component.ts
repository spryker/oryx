import { ContentMixin } from '@spryker-oryx/experience';
import { hydratable, i18n, signal, signalAware } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { TotalsController } from '../../src/controllers';

@hydratable('window:load')
@signalAware()
export class CartTotalsComponent extends ContentMixin(LitElement) {
  protected totalsController = new TotalsController(this);

  protected $totals = signal(this.totalsController.getTotals());

  protected override render(): TemplateResult | void {
    if (this.$totals()) {
      return html`<h2>${i18n('cart.totals.summary')}</h2>
        <oryx-composition .uid=${this.uid}></oryx-composition>`;
    }
  }
}
