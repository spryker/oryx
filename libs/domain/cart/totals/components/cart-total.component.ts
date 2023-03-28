import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/ui';
import { CollapsibleAppearance } from '@spryker-oryx/ui/collapsible';
import { hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { CartComponentMixin } from '../../src/mixins/cart.mixin';
import { PriceMode } from '../../src/models';
import {
  CartTotalsDiscountOptions,
  CartTotalsTotalOptions,
  DiscountRowsAppearance,
} from './cart-total.model';

@hydratable('window:load')
export class CartTotalsSubtotalComponent extends CartComponentMixin(
  LitElement
) {
  protected override render(): TemplateResult | void {
    if (!this.totals?.calculations.subtotal) return;

    return html`
      <span>${i18n('cart.totals.subtotal')}</span>
      <span>${String(this.totals.calculations.subtotal)}</span>
    `;
  }
}

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
      <span>${i18n('cart.totals.discount')}</span>
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
      <span slot="header">${i18n('cart.totals.discount')}</span>
      <span slot="aside">${calculations.discountTotal}</span>
      ${rows}
    </oryx-collapsible>`;
  }
}

@hydratable('window:load')
export class CartTotalsExpenseComponent extends CartComponentMixin(LitElement) {
  protected override render(): TemplateResult | void {
    if (!this.totals?.calculations.expenseTotal) return;

    return html`
      <span>${i18n('cart.totals.expense')}</span>
      <span>${String(this.totals.calculations.expenseTotal)}</span>
    `;
  }
}

@hydratable('window:load')
export class CartTotalsTaxComponent extends CartComponentMixin(LitElement) {
  protected override render(): TemplateResult | void {
    if (!this.totals?.calculations.taxTotal) return;

    return html`
      <span>${i18n('cart.totals.tax')}</span>
      <span>${String(this.totals.calculations.taxTotal)}</span>
    `;
  }
}

@hydratable('window:load')
export class CartTotalsDeliveryComponent extends CartComponentMixin(
  LitElement
) {
  protected override render(): TemplateResult | void {
    if (!this.totals?.calculations.taxTotal) return;

    return html`
      <span>${i18n('cart.totals.delivery')}</span>
      <span>
        Not implemented yet
        <oryx-icon-button size=${Size.Sm}>
          <a href="#" title=${i18n('cart.totals.delivery-message')}>
            <oryx-icon type="info"></oryx-icon>
          </a> </oryx-icon-button
      ></span>
    `;
  }
}

@defaultOptions({ enableTaxMessage: true })
@hydratable('window:load')
export class CartTotalsTotalComponent extends CartComponentMixin(
  ContentMixin<CartTotalsTotalOptions>(LitElement)
) {
  protected override render(): TemplateResult | void {
    if (!this.totals?.calculations.priceToPay) return;
    const taxMessage = this.componentOptions?.enableTaxMessage
      ? html`<span class="tax-message">
          ${this.totals?.priceMode === PriceMode.GrossMode
            ? i18n('cart.totals.tax-included')
            : i18n('cart.totals.tax-included')}
        </span>`
      : html``;

    return html`
      <span>${i18n('cart.totals.total')}</span>
      <span>${String(this.totals.calculations.priceToPay)}</span>
      ${taxMessage}
    `;
  }
}
