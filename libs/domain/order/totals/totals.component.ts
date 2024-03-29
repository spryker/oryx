import { TotalsController } from '@spryker-oryx/cart';
import { ContentMixin } from '@spryker-oryx/experience';
import { hydrate, signal, signalAware } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';

@hydrate({ event: 'window:load' })
@signalAware()
export class OrderTotalsComponent extends ContentMixin(LitElement) {
  protected totalsController = new TotalsController(this);

  connectedCallback(): void {
    super.connectedCallback();

    this.totalsController.provideContext('ORDER');
  }

  protected $totals = signal(this.totalsController.getTotals());

  protected override render(): TemplateResult | void {
    if (this.$totals()) {
      return html`<h2>${this.i18n('order.totals.summary')}</h2>
        <oryx-composition .uid=${this.uid}></oryx-composition>`;
    }
  }
}
