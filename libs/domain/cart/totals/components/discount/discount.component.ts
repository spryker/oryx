import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { CollapsibleAppearance } from '@spryker-oryx/ui/collapsible';
import { hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';

import { CartComponentMixin } from '../../../src/mixins/cart.mixin';
import {
  CartTotalsDiscountOptions,
  DiscountRowsAppearance,
} from './discount.model';

@defaultOptions({
  discountRowsAppearance: DiscountRowsAppearance.Expanded,
} as CartTotalsDiscountOptions)
@hydratable('window:load')
export class CartTotalsDiscountComponent extends CartComponentMixin(
  ContentMixin<CartTotalsDiscountOptions>(LitElement)
) {
  protected override render(): TemplateResult | void {
    const { discountRowsAppearance } = this.componentOptions ?? {};
    const { calculations, discounts } = this.totals ?? {};

    if (!calculations?.discountTotal) return;

    const heading = html`
      <span>
        ${i18n('cart.totals.<count>-discounts', { count: discounts?.length })}
      </span>
      <span>${String(calculations.discountTotal)}</span>
    `;

    if (
      discountRowsAppearance === DiscountRowsAppearance.None ||
      !discounts?.length
    ) {
      return heading;
    }

    const rows = html`<ul>
      ${discounts.map(
        ({ displayName, amount }) =>
          html`<li>
            <span>${displayName}</span>
            <span>${amount}</span>
          </li>`
      )}
    </ul>`;

    if (discountRowsAppearance === DiscountRowsAppearance.Inline) {
      return html`${heading}${rows}`;
    }

    return html`<oryx-collapsible
      class="discount"
      appearance="${CollapsibleAppearance.Inline}"
      ?open=${discountRowsAppearance !== DiscountRowsAppearance.Collapsed}
    >
      <span slot="header">
        ${i18n('cart.totals.<count>-discounts', { count: discounts.length })}
      </span>
      <span slot="aside">${calculations.discountTotal}</span>
      ${rows}
    </oryx-collapsible>`;
  }
}
