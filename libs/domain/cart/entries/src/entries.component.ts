import { CartComponentMixin } from '@spryker-oryx/cart';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { RemoveByQuantity } from '../../entry/src';
import { CartEntriesOptions } from './entries.model';
import { cartEntriesStyles } from './entries.styles';

@defaultOptions({
  removeByQuantity: RemoveByQuantity.ShowBin,
  enableId: true,
  enablePreview: true,
  confirmBeforeRemove: true,
  notifyOnUpdate: false,
  notifyOnRemove: false,
})
@hydratable('window:load')
export class CartEntriesComponent extends CartComponentMixin(
  ContentMixin<CartEntriesOptions>(LitElement)
) {
  static styles = cartEntriesStyles;

  // TODO: implement loading state
  protected override render(): TemplateResult | void {
    if (this.isEmpty) {
      return this.renderEmpty();
    }

    return html`
      <oryx-heading>
        <h1>
          ${i18n('cart.totals.<count>-items', {
            count: this.totalQuantity,
          })}
        </h1>
      </oryx-heading>

      ${repeat(
        this.entries ?? [],
        (entry) => entry.groupKey,
        (entry) =>
          html`
            <oryx-cart-entry
              .sku=${entry.sku}
              .quantity=${entry.quantity}
              .price=${entry.calculations?.sumPrice}
              .key=${entry.groupKey}
              .options=${this.componentOptions}
              ?readonly=${this.componentOptions?.readonly}
            ></oryx-cart-entry>
          `
      )}
    `;
  }

  // TODO: we like to remove this, since this should be content managed
  protected renderEmpty(): TemplateResult {
    return html`
      <section class="empty">
        <oryx-icon type="cart"></oryx-icon>
        <p>Your shopping cart is empty</p>
        <oryx-button size="large">
          <button>Shop now</button>
        </oryx-button>
      </section>
    `;
  }
}
