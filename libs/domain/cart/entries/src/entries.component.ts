import { CartComponentMixin } from '@spryker-oryx/cart';
import { RemoveByQuantity } from '@spryker-oryx/cart/entry';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { hydrate } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
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

  // TODO: implement loading state
  protected override render(): TemplateResult | void {
    if (this.$isEmpty()) return this.renderEmpty();

    return html`
      <oryx-heading>
        <h1>
          ${this.i18n('cart.totals.<count>-items', {
            count: this.$totalQuantity(),
          })}
        </h1>
      </oryx-heading>

      ${repeat(
        this.$entries(),
        (entry) => entry.groupKey,
        (entry) => {
          return html`
            <oryx-cart-entry
              .sku=${entry.sku}
              .quantity=${entry.quantity}
              .price=${entry.calculations?.sumPriceToPayAggregation}
              .key=${entry.groupKey}
              .options=${this.$options()}
              ?readonly=${this.$options().readonly}
            ></oryx-cart-entry>
          `;
        }
      )}
    `;
  }

  // TODO: we like to remove this, since this should be content managed
  protected renderEmpty(): TemplateResult {
    return html`
      <section class="empty">
        <oryx-icon .type=${IconTypes.Cart}></oryx-icon>
        <p>Your shopping cart is empty</p>
        <oryx-button size="large">
          <button>Shop now</button>
        </oryx-button>
      </section>
    `;
  }
}
