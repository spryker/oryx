import { CartComponentMixin } from '@spryker-oryx/cart';
import { RemoveByQuantity } from '@spryker-oryx/cart/entry';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { featureVersion, hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { CartEntriesOptions } from './entries.model';
import { cartEntriesStyles } from './entries.styles';

@defaultOptions({
  removeByQuantity: RemoveByQuantity.ShowBin,
  confirmBeforeRemove: true,
  enableItemId: true,
  enableItemImage: true,
  enableItemPrice: true,
} as CartEntriesOptions)
@hydrate({ event: 'window:load' })
export class CartEntriesComponent extends CartComponentMixin(
  ContentMixin<CartEntriesOptions>(LitElement)
) {
  static styles = cartEntriesStyles;

  protected override render(): TemplateResult | void {
    if (this.$isEmpty()) return;

    return html`
      ${when(
        featureVersion < '1.2',
        () => html`<oryx-heading>
          <h1>
            ${this.i18n('cart.totals.<count>-items', {
              count: this.$totalQuantity(),
            })}
          </h1>
        </oryx-heading>`
      )}
      ${repeat(
        this.$entries(),
        (entry) => entry.groupKey,
        (entry) => {
          return html`
            <oryx-cart-entry
              data-merchant=${entry.merchantReference}
              .entry=${entry}
              .currency=${this.$cart()?.currency}
              .quantity=${entry.quantity}
              .price=${entry.calculations?.sumPriceToPayAggregation}
              .itemPrice=${entry.calculations?.unitPriceToPayAggregation}
              .unitPrice=${entry.calculations?.unitPrice}
              .discountedUnitPrice=${entry.calculations
                ?.unitPriceToPayAggregation}
              .key=${entry.groupKey}
              .options=${this.$options()}
              ?readonly=${this.$options().readonly}
            ></oryx-cart-entry>
          `;
        }
      )}
    `;
  }
}
