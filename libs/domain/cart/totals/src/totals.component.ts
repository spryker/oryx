import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import {
  elementEffect,
  hydratable,
  i18n,
  signal,
  signalAware,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { TotalsController } from '../../src/controllers';
import { CartTotalsOptions } from './totals.model';

@defaultOptions({
  reference: { context: 'CART' },
})
@hydratable('window:load')
@signalAware()
export class CartTotalsComponent extends ContentMixin<CartTotalsOptions>(
  LitElement
) {
  protected totalsController = new TotalsController(this);

  @elementEffect()
  protected bindContext = (): void => {
    const reference = this.$options().reference;

    if (reference) {
      this.totalsController.provideContext(reference);
    }
  };

  protected $totals = signal(this.totalsController.getTotals());

  protected override render(): TemplateResult | void {
    if (this.$totals()) {
      return html`<h2>${i18n('cart.totals.summary')}</h2>
        <oryx-composition .uid=${this.uid}></oryx-composition>`;
    }
  }
}
