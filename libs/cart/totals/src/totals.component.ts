import { ContentController } from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { CollapsibleAppearance } from '@spryker-oryx/ui/collapsible';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { combineLatest } from 'rxjs';
import {
  CartController,
  FormattedCartTotals,
} from '../../src/controllers/cart.controller';
import { CartComponentMixin } from '../../src/mixins/cart.mixin';
import { PriceMode } from '../../src/models';
import { CartTotalsComponentOptions } from './totals.model';
import { styles } from './totals.styles';
export class CartTotalsComponent extends CartComponentMixin<CartTotalsComponentOptions>() {
  static styles = styles;

  protected options$ = new ContentController(this).getOptions();
  protected totals$ = new CartController(this).getTotals();
  protected cartTotals$ = combineLatest([this.totals$, this.options$]);

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(this.cartTotals$, ([totals, options]) => {
        if (!totals) {
          return html``;
        }

        return html`
          <h4>Summary</h4>
          ${this.renderSubtotal(options, totals)}
          ${this.renderDiscounts(options, totals)}
          ${this.renderExpense(options, totals)}
          ${this.renderTax(options, totals)}
          ${this.renderDelivery(options, totals)}
          ${this.renderSummary(options, totals)}
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
          html`
            Subtotal
            <span
              >(${totals.itemsQuantity}
              item${totals.itemsQuantity === 1 ? '' : 's'})</span
            >
          `,
          String(totals.calculations?.subtotal)
        )
      : html``;
  }

  protected renderDiscounts(
    options: CartTotalsComponentOptions,
    totals: FormattedCartTotals
  ): TemplateResult {
    return html`
      ${when(
        !options.hideDiscounts && totals.calculations.discountTotal,
        () => html`
          <oryx-collapsible
            class="discounts"
            appearance="${CollapsibleAppearance.Inline}"
            header="Discounts"
            ?open=${!options.collapseDiscounts}
          >
            <span slot="aside">${totals.calculations.discountTotal}</span>

            ${totals?.discounts?.map(({ displayName, amount }) =>
              this.renderSection('discount', displayName, amount)
            )}
          </oryx-collapsible>
        `
      )}
    `;
  }

  protected renderExpense(
    options: CartTotalsComponentOptions,
    totals: FormattedCartTotals
  ): TemplateResult {
    return !options.hideExpense && totals.calculations.expenseTotal
      ? this.renderSection(
          'expense',
          'Expense',
          String(totals.calculations.expenseTotal)
        )
      : html``;
  }

  protected renderTax(
    options: CartTotalsComponentOptions,
    totals: FormattedCartTotals
  ): TemplateResult {
    return !options.hideTaxAmount
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
          'Delivery',
          html`
            <small class="delivery-message">
              ${options?.deliveryMessage ?? ''}
              <oryx-icon-button size="small">
                <a href="#" title="Click here to read about delivery options">
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
      'Total',
      html` ${totals.calculations.priceToPay}
      ${when(
        !options.hideTaxMessage,
        () =>
          html`<small class="tax-message">
            ${totals.priceMode === PriceMode.GrossMode
              ? 'incl. tax'
              : 'excl. tax'}
          </small>`
      )}`
    );
  }

  protected renderSection(
    type: string,
    title: string | TemplateResult,
    content: string | TemplateResult
  ): TemplateResult {
    return html`
      <dl class=${type}>
        <dt>${title}</dt>
        <dd>${content}</dd>
      </dl>
    `;
  }
}
