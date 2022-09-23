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

  protected cartTotals$ = combineLatest([
    new CartController().getTotals(),
    new ContentController(this).getOptions(),
  ]);

  protected renderSection(
    title: string | TemplateResult,
    content: string | TemplateResult
  ): TemplateResult {
    return html`
      <h5>${title}</h5>
      <div>${content}</div>
    `;
  }

  protected renderDiscountsSection(
    options: CartTotalsComponentOptions,
    totals: FormattedCartTotals
  ): TemplateResult {
    return html`
      ${when(
        options.showDiscounts && totals.calculations.discountTotal,
        () => html`
          <oryx-collapsible appearance="${CollapsibleAppearance.Inline}" open>
            <span slot="header">Discounts</span>

            <span slot="aside">-${totals.calculations.discountTotal}</span>
            ${when(
              totals?.discounts,
              () =>
                html`<div>
                  ${totals?.discounts?.map(
                    (discount) => html` <div>${discount.displayName}</div>
                      <div>-${discount.amount}</div>`
                  )}
                </div>`
            )}
          </oryx-collapsible>
        `
      )}
    `;
  }

  protected renderDeliverySection(
    options: CartTotalsComponentOptions
  ): TemplateResult {
    return this.renderSection(
      'Delivery',
      html`
        <span class="delivery-message">${options?.deliveryMessage ?? ''}</span>
        <oryx-icon-button size="small">
          <a href="#" title="Click here to read about delivery options">
            <oryx-icon type="info"></oryx-icon>
          </a>
        </oryx-icon-button>
      `
    );
  }

  protected renderSummarySection(
    options: CartTotalsComponentOptions,
    totals: FormattedCartTotals
  ): TemplateResult {
    return this.renderSection(
      'Total',
      html` ${totals.calculations.priceToPay}
      ${when(
        options.showTaxMessage,
        () =>
          html`<div>
            ${totals.priceMode === PriceMode.GrossMode
              ? 'incl. tax'
              : 'excl. tax'}
          </div>`
      )}`
    );
  }

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(this.cartTotals$, ([totals, options]) => {
        if (!totals || totals === null) {
          return html``;
        }

        return html`
          <h4>Summary</h4>

          ${this.renderSection(
            html`
              Subtotal
              <span>(${totals.itemsQuantity} items)</span>
            `,
            String(totals.calculations.subtotal)
          )}
          ${this.renderDiscountsSection(options, totals)}
          ${when(totals.calculations.expenseTotal, () =>
            this.renderSection(
              'Expense',
              String(totals.calculations.expenseTotal)
            )
          )}
          ${when(options.showTax, () =>
            this.renderSection('Tax', String(totals.calculations.taxTotal))
          )}
          ${this.renderDeliverySection(options)}

          <hr />

          ${this.renderSummarySection(options, totals)}
        `;
      })}
    `;
  }
}
