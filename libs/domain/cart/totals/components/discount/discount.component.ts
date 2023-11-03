import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { CollapsibleAppearance } from '@spryker-oryx/ui/collapsible';
import { hydrate, signal, signalAware } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { TotalsController } from '../../../src/controllers';
import { CartDiscount } from '../../../src/models';
import {
  CartTotalsDiscountOptions,
  DiscountRowsAppearance,
} from './discount.model';

@defaultOptions({
  discountRowsAppearance: DiscountRowsAppearance.Expanded,
} as CartTotalsDiscountOptions)
@hydrate({ event: 'window:load' })
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

    if (discountRowsAppearance === DiscountRowsAppearance.None)
      return this.renderHeading();

    if (discountRowsAppearance === DiscountRowsAppearance.Inline) {
      return html`${this.renderHeading()}${this.renderDiscounts(
        discounts,
        currency
      )}`;
    }

    return this.renderCollapsible();
  }

  protected renderHeading(): TemplateResult | void {
    const { discounts, discountTotal, currency } = this.$totals()!;
    return html`
      <span>
        ${discounts
          ? this.i18n('cart.totals.<count>-discounts', {
              count: discounts.length,
            })
          : this.i18n('cart.totals.discounts')}
      </span>
      <oryx-site-price
        .value=${-discountTotal!}
        .currency=${currency}
      ></oryx-site-price>
    `;
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
      appearance="${CollapsibleAppearance.Inline}"
      ?open=${this.$options().discountRowsAppearance !==
      DiscountRowsAppearance.Collapsed}
    >
      <span slot="heading">
        ${this.i18n('cart.totals.<count>-discounts', {
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
