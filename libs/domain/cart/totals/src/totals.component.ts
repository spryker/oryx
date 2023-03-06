import { ContentController } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/ui';
import { CollapsibleAppearance } from '@spryker-oryx/ui/collapsible';
import { asyncValue, hydratable, i18n } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { combineLatest } from 'rxjs';
import { CartController } from '../../src/controllers/cart.controller';
import { CartComponentMixin } from '../../src/mixins/cart.mixin';
import { FormattedCartTotals, PriceMode } from '../../src/models';
import {
  CartTotalsComponentOptions,
  DiscountRowsAppearance,
} from './totals.model';
import { styles } from './totals.styles';

@hydratable('window:load')
export class CartTotalsComponent extends CartComponentMixin<CartTotalsComponentOptions>() {
  static styles = styles;

  protected cartTotals$ = combineLatest([
    new CartController(this).getTotals(),
    new ContentController(this).getOptions(),
  ]);

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(this.cartTotals$, ([totals, options]) => {
        if (!totals) {
          return html``;
        }

        return html`
          <oryx-heading appearance="h4">
            <h2>${i18n('cart.totals.summary')}</h2>
          </oryx-heading>
          <section>
            ${this.renderSubtotal(options, totals)}
            ${this.renderDiscounts(options, totals)}
            ${this.renderExpense(options, totals)}
            ${this.renderTax(options, totals)}
            ${this.renderDelivery(options, totals)}
            ${this.renderSummary(options, totals)}
          </section>
        `;
      })}
    `;
  }

  protected renderSubtotal(
    options: CartTotalsComponentOptions,
    totals: FormattedCartTotals
  ): TemplateResult {
    return !options.hideSubtotal
      ? this.renderSection(
          'subtotal',
          html`${i18n('cart.totals.subtotal')}`,
          String(totals.calculations?.subtotal)
        )
      : html``;
  }

  protected renderDiscounts(
    options: CartTotalsComponentOptions,
    totals: FormattedCartTotals
  ): TemplateResult {
    if (options.hideDiscounts || !totals.calculations.discountTotal) {
      return html``;
    }
    const heading = this.renderSection(
      'discounts',
      html`${i18n('cart.totals.discount')}`,
      String(totals.calculations.discountTotal)
    );

    if (
      options.discountRowsAppearance === DiscountRowsAppearance.None ||
      !totals.discounts?.length
    ) {
      return heading;
    }

    const rows = html`<ul class="discounts">
      ${totals.discounts?.map(
        ({ displayName, amount }) =>
          html`<li>
            <span>${displayName}</span>
            <span>${amount}</span>
          </li>`
      )}
    </ul>`;

    if (options.discountRowsAppearance === DiscountRowsAppearance.Inline) {
      return html`${heading}${rows}`;
    }

    return html`<oryx-collapsible
      class="discount"
      appearance="${CollapsibleAppearance.Inline}"
      ?open=${options.discountRowsAppearance !==
      DiscountRowsAppearance.Collapsed}
    >
      <oryx-heading slot="header" appearance="h6" sm-appearance="h3">
        <h3>${i18n('cart.totals.discount')}</h3>
      </oryx-heading>
      <oryx-heading slot="aside" appearance="h6" sm-appearance="h3">
        ${totals.calculations.discountTotal}
      </oryx-heading>
      ${rows}
    </oryx-collapsible>`;
  }

  protected renderExpense(
    options: CartTotalsComponentOptions,
    totals: FormattedCartTotals
  ): TemplateResult {
    return totals.calculations.expenseTotal && !options.hideExpense
      ? this.renderSection(
          'expense',
          html`${i18n('cart.totals.expense')}`,
          String(totals.calculations.expenseTotal)
        )
      : html``;
  }

  protected renderTax(
    options: CartTotalsComponentOptions,
    totals: FormattedCartTotals
  ): TemplateResult {
    return totals.calculations.taxTotal && !options.hideTaxAmount
      ? this.renderSection('tax', 'Tax', String(totals.calculations.taxTotal))
      : html``;
  }

  protected renderDelivery(
    options: CartTotalsComponentOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    totals: FormattedCartTotals
  ): TemplateResult {
    return options.hideDelivery
      ? html``
      : this.renderSection(
          'delivery',
          html`${i18n('cart.totals.delivery')}`,
          html`
            <small class="delivery-message">
              ${ifDefined(options?.deliveryMessage)}
              <oryx-icon-button size=${Size.Sm}>
                <a href="#" title=${i18n('cart.totals.delivery-message')}>
                  <oryx-icon type="info"></oryx-icon>
                </a>
              </oryx-icon-button>
            </small>
          `
        );
  }

  protected renderSummary(
    options: CartTotalsComponentOptions,
    totals: FormattedCartTotals
  ): TemplateResult {
    return this.renderSection(
      'summary',
      html`${i18n('cart.totals.total')}`,
      html` ${totals.calculations.priceToPay}
      ${when(
        !options.hideTaxMessage,
        () =>
          html`<small class="tax-message">
            ${totals.priceMode === PriceMode.GrossMode
              ? i18n('cart.totals.tax-included')
              : i18n('cart.totals.tax-excluded')}
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
      <oryx-heading appearance="h6" sm-appearance="h3" class=${type}>
        <h3>${title}</h3>
        <span>${value}</span>
      </oryx-heading>
    `;
  }
}
