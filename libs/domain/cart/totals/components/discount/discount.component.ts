import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { CollapsibleAppearance } from '@spryker-oryx/ui/collapsible';
import { hydratable, i18n, signal, signalAware } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { TotalsController } from '../../../src/controllers';
import { CartDiscount } from '../../../src/models';
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

  protected $totals = signal(this.totalsController.getTotals());

  protected override render(): TemplateResult | void {
    const { discountTotal, discounts, currency } = this.$totals() ?? {};

    if (!discountTotal) return;

    const { discountRowsAppearance } = this.$options();

    if (discountRowsAppearance === DiscountRowsAppearance.None) {
      return this.renderHeading();
    }

    if (discountRowsAppearance === DiscountRowsAppearance.Inline) {
      return html`${this.renderHeading()}${this.renderDiscounts(
        discounts,
        currency
      )}`;
    }

    return this.renderCollapsible();
  }

  protected renderHeading(): TemplateResult | void {
    const totals = this.$totals();
    if (totals?.discountTotal) {
      return html`
        <span>
          ${totals.discounts
            ? i18n('cart.totals.<count>-discounts', {
                count: totals.discounts.length,
              })
            : i18n('cart.totals.discounts')}
        </span>
        <oryx-site-price
          slot="aside"
          .value=${-totals.discountTotal}
          .currency=${totals.currency}
        ></oryx-site-price>
      `;
    }
  }

  protected renderDiscounts(
    discounts?: CartDiscount[],
    currency?: string
  ): TemplateResult | void {
    if (!discounts?.length) return;
    return html`<ul>
      ${discounts.map(
        ({ displayName, amount }) =>
          html`<li>
            <span>${displayName}</span>
            <oryx-site-price
              .value=${-amount}
              .currency=${currency}
            ></oryx-site-price>
          </li>`
      )}
    </ul>`;
  }

  protected renderCollapsible(): TemplateResult | void {
    const { discountTotal, discounts, currency } = this.$totals() ?? {};
    if (!discountTotal || !discounts?.length) return;
    return html`<oryx-collapsible
      class="discount"
      appearance="${CollapsibleAppearance.Inline}"
      ?open=${this.$options().discountRowsAppearance !==
      DiscountRowsAppearance.Collapsed}
    >
      <span slot="heading">
        ${i18n('cart.totals.<count>-discounts', {
          count: discounts.length,
        })}
      </span>
      <oryx-site-price
        slot="aside"
        .value=${-discountTotal}
        .currency=${currency}
      ></oryx-site-price>
      ${this.renderDiscounts(discounts, currency)}
    </oryx-collapsible>`;
  }
}
