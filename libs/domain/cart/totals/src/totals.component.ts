import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/ui';
import { CollapsibleAppearance } from '@spryker-oryx/ui/collapsible';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { CartComponentMixin } from '../../src/mixins/cart.mixin';
import { PriceMode } from '../../src/models';
import {
  CartTotalsComponentOptions,
  DiscountRowsAppearance,
} from './totals.model';
import { styles } from './totals.styles';

@defaultOptions({
  enableDiscounts: true,
  enableExpense: true,
  enableSubtotal: true,
  enableTaxAmount: true,
  enableDelivery: true,
  enableTaxMessage: true,
} as CartTotalsComponentOptions)
@hydratable('window:load')
export class CartTotalsComponent extends CartComponentMixin(
  ContentMixin<CartTotalsComponentOptions>(LitElement)
) {
  static styles = [styles];

  protected override render(): TemplateResult | void {
    if (!this.totals) return;

    return html`
      <oryx-heading as=${HeadingTag.H3} as-sm="hide">
        <h2>${i18n('cart.totals.summary')}</h2>
      </oryx-heading>
      <section>
        ${this.renderSubtotal()} ${this.renderDiscounts()}
        ${this.renderExpense()} ${this.renderTax()} ${this.renderDelivery()}
        ${this.renderSummary()}
      </section>
    `;
  }

  protected renderSubtotal(): TemplateResult | void {
    if (!this.componentOptions?.enableSubtotal) {
      return;
    }

    return this.renderSection(
      'subtotal',
      html`${i18n('cart.totals.subtotal')}`,
      String(this.totals?.calculations.subtotal)
    );
  }

  protected renderDiscounts(): TemplateResult | void {
    const { discountRowsAppearance, enableDiscounts } =
      this.componentOptions ?? {};
    const { calculations, discounts } = this.totals ?? {};

    if (!enableDiscounts || !calculations?.discountTotal) {
      return;
    }

    const heading = this.renderSection(
      'discounts',
      html`${i18n('cart.totals.discount')}`,
      String(calculations.discountTotal)
    );

    if (
      discountRowsAppearance === DiscountRowsAppearance.None ||
      !discounts?.length
    ) {
      return heading;
    }

    const rows = html`<ul class="discounts">
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
      <oryx-heading slot="header" as="h6" as-sm="h3">
        <h3>${i18n('cart.totals.discount')}</h3>
      </oryx-heading>
      <oryx-heading slot="aside" as="h6" as-sm="h3">
        ${calculations.discountTotal}
      </oryx-heading>
      ${rows}
    </oryx-collapsible>`;
  }

  protected renderExpense(): TemplateResult | void {
    const { calculations } = this.totals ?? {};

    if (!this.componentOptions.enableExpense || !calculations?.expenseTotal)
      return;

    return this.renderSection(
      'expense',
      html`${i18n('cart.totals.expense')}`,
      String(calculations.expenseTotal)
    );
  }

  protected renderTax(): TemplateResult | void {
    const { calculations } = this.totals ?? {};
    if (!this.componentOptions?.enableTaxAmount || !calculations?.taxTotal)
      return;

    return this.renderSection(
      'tax',
      html`${i18n(['cart.totals.tax'])}`,
      String(calculations.taxTotal)
    );
  }

  protected renderDelivery(): TemplateResult | void {
    if (!this.componentOptions?.enableDelivery) return;

    return this.renderSection(
      'delivery',
      html`${i18n('cart.totals.delivery')}`,
      html`
        <small class="delivery-message">
          ${ifDefined(this.componentOptions?.deliveryMessage)}
          <oryx-icon-button size=${Size.Sm}>
            <a href="#" title=${i18n('cart.totals.delivery-message')}>
              <oryx-icon type="info"></oryx-icon>
            </a>
          </oryx-icon-button>
        </small>
      `
    );
  }

  protected renderSummary(): TemplateResult | void {
    return this.renderSection(
      'summary',
      html`${i18n('cart.totals.total')}`,
      html` ${this.totals?.calculations?.priceToPay}
      ${when(
        this.componentOptions.enableTaxMessage,
        () =>
          html`<small class="tax-message">
            ${this.totals?.priceMode === PriceMode.GrossMode
              ? i18n('cart.totals.tax-included')
              : i18n('cart.totals.tax-included')}
          </small>`
      )}`
    );
  }

  protected renderSection(
    type: string,
    title: string | TemplateResult,
    value: string | TemplateResult
  ): TemplateResult {
    return html`
      <oryx-heading as="h6" as-sm="h3" class=${type}>
        <h3>${title}</h3>
        <span>${value}</span>
      </oryx-heading>
    `;
  }
}
