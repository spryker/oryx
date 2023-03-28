import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { CartComponentMixin } from '../../src/mixins/cart.mixin';
import { CartTotalsComponentOptions } from './totals.model';
import { styles } from './totals.styles';

@defaultOptions({
  enableDiscount: true,
  enableExpense: true,
  enableSubtotal: true,
  enableTax: true,
  enableDelivery: true,
  enableTaxMessage: true,
  deliveryMessage: 'not yet implemented',
} as CartTotalsComponentOptions)
@hydratable('window:load')
export class CartTotalsComponent extends CartComponentMixin(
  ContentMixin<CartTotalsComponentOptions>(LitElement)
) {
  static styles = [styles];

  protected override render(): TemplateResult | void {
    if (!this.totals) return;
    const o = this.componentOptions ?? {};
    return html`
      <h2>${i18n('cart.totals.summary')}</h2>

      <section>
        ${when(
          o.enableSubtotal,
          () => html`<oryx-cart-totals-subtotal></oryx-cart-totals-subtotal>`
        )}
        ${when(
          o.enableDiscount,
          () => html`<oryx-cart-totals-discount></oryx-cart-totals-discount>`
        )}
        ${when(
          o.enableExpense,
          () => html`<oryx-cart-totals-expense></oryx-cart-totals-expense>`
        )}
        ${when(
          o.enableTax,
          () => html`<oryx-cart-totals-tax></oryx-cart-totals-tax>`
        )}
        ${when(
          o.enableDelivery,
          () => html`<oryx-cart-totals-delivery></oryx-cart-totals-delivery>`
        )}
        <oryx-cart-totals-total></oryx-cart-totals-total>
      </section>
    `;
  }
}
