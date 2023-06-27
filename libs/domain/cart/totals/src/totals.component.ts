import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { hydratable, i18n, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { CartComponentMixin } from '../../src/mixins/cart.mixin';
import { TotalsController } from '../../src/services';
import { CartTotalsOptions } from './totals.model';

@defaultOptions({
  reference: 'CART'
})
@hydratable('window:load')
export class CartTotalsComponent extends CartComponentMixin(
  ContentMixin<CartTotalsOptions>(LitElement)
) {
  protected totalsController = new TotalsController(this);

  connectedCallback(): void {
    super.connectedCallback();

    this.totalsController.provideContext(this.$options().reference!);
  }

  protected $t = signal(this.totalsController.getTotals());

  protected override render(): TemplateResult | void {
    if (this.$totals()) {
      return html`<h2>${i18n('cart.totals.summary')}</h2>
        <oryx-composition .uid=${this.uid}></oryx-composition>`;
    }
  }
}
