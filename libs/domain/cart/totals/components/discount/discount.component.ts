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
    const totals = this.$totals();

    if (!totals || !totals.calculations?.discountTotal) return;
    const { discountRowsAppearance } = this.$options();

    if (
      discountRowsAppearance === DiscountRowsAppearance.None ||
      !totals.discounts?.length
    ) {
      return this.renderHeading();
    }

    const rows = html`<ul>
      ${totals.discounts.map(
        ({ displayName, amount }) =>
          html`<li>
            <span>${displayName}</span>
            <span>${amount}</span>
          </li>`
      )}
    </ul>`;

    if (discountRowsAppearance === DiscountRowsAppearance.Inline) {
      return html`${this.renderHeading()}${rows}`;
    }

    return html`<oryx-collapsible
      class="discount"
      appearance="${CollapsibleAppearance.Inline}"
      ?open=${discountRowsAppearance !== DiscountRowsAppearance.Collapsed}
    >
      <span slot="heading">
        ${i18n('cart.totals.<count>-discounts', {
          count: totals.discounts.length,
        })}
      </span>
      <span slot="aside">${totals.calculations.discountTotal}</span>
      ${rows}
    </oryx-collapsible>`;
  }

  protected renderHeading(): TemplateResult | void {
    const totals = this.$totals();

    if (totals) {
      return html`
        <span>
          ${i18n('cart.totals.<count>-discounts', {
            count: totals.discounts?.length,
          })}
        </span>
        <span>${String(totals.calculations.discountTotal)}</span>
      `;
    }
  }
}
