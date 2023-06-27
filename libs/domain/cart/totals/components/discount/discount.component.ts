import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { CollapsibleAppearance } from '@spryker-oryx/ui/collapsible';
import { hydratable, i18n, signal, signalAware } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { TotalsController } from '../../../src/controllers';
import {
  CartTotalsDiscountOptions,
  DiscountRowsAppearance,
} from './discount.model';

@defaultOptions({
  discountRowsAppearance: DiscountRowsAppearance.Expanded,
} as CartTotalsDiscountOptions)
@hydratable('window:load')
@signalAware()
export class CartTotalsDiscountComponent extends ContentMixin<CartTotalsDiscountOptions>(
  LitElement
) {
  protected totalsController = new TotalsController(this);

  protected $totals = signal(this.totalsController.getFormattedTotals());

  protected override render(): TemplateResult | void {
    const totals = this.$totals();

    console.log(totals);

    if (!totals) return;

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
      <span slot="aside">${totals.discountTotal}</span>
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
        <span>${String(totals.discountTotal)}</span>
      `;
    }
  }
}
