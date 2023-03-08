import { CartComponentMixin, CartService } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductService } from '@spryker-oryx/product';
import {
  asyncState,
  hydratable,
  i18n,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { CartEntryChangeEventDetail } from '../../entry/src';
import { CartEntriesOptions } from './entries.model';
import { cartEntriesStyles } from './entries.styles';

@defaultOptions({
  defaultExpandedOptions: true,
  silentRemove: false,
} as CartEntriesOptions)
@hydratable('window:load')
export class CartEntriesComponent extends CartComponentMixin(
  ContentMixin<CartEntriesOptions>(LitElement)
) {
  static styles = cartEntriesStyles;

  protected cartService = resolve(CartService);
  protected productService = resolve(ProductService);

  @asyncState()
  protected isLoading = valueType(this.cartService.getLoadingState());

  protected override render(): TemplateResult | void {
    if (!this.entries?.length) return this.renderEmpty();

    if (this.componentOptions?.collapsible) {
      return this.renderCollapsible();
    } else {
      return this.renderEntries();
    }
  }

  constructor() {
    super();

    this.addEventListener('submit', this.onUpdate as EventListener);
  }

  /**
   * Handles updates on the entry. When the quantity is 0, the entry is going
   * to be removed unless the component options require to seek for confirmation first.
   */
  protected onUpdate(ev: CustomEvent<CartEntryChangeEventDetail>): void {
    const { groupKey, quantity, sku } = ev.detail;
    // if (ev.detail.quantity === 0) {
    //   if (this.componentOptions?.silentRemove) {
    //     this.onRemove(ev.detail.groupKey);
    //   } else {
    //     this.requestRemoval = ev.detail.groupKey;
    //   }
    // } else {
    this.cartService.updateEntry({
      groupKey,
      quantity,
      sku,
    });
    // }
  }

  protected renderCollapsible(): TemplateResult {
    return html`<oryx-collapsible ?open=${this.componentOptions?.expanded}>
      <span slot="header"
        >${i18n('cart.entries.products-<quantity>', {
          quantity: this.totalQuantity,
        })}
      </span>

      ${this.renderEntries()}
    </oryx-collapsible> `;
  }

  protected renderEntries(): TemplateResult | void {
    if (!this.entries?.length) return;

    return html`
      <oryx-heading appearance="h4" sm-appearance="h3">
        <h1>${i18n('cart.totals.<count>-items', { count: 7 })}</h1>
      </oryx-heading>

      ${repeat(
        this.entries,
        (entry) => entry.groupKey,
        (entry) =>
          html`
            <cart-entry
              .key=${entry.groupKey}
              ?readonly=${this.componentOptions.readonly}
            ></cart-entry>
          `
      )}
    `;
  }

  // TODO: we like to remove this, since this should be content managed
  protected renderEmpty(): TemplateResult {
    return html`
      <section>
        <oryx-icon type="cart"></oryx-icon>
        <p>Your shopping cart is empty</p>
        <oryx-button>
          <button>Shop now</button>
        </oryx-button>
      </section>
    `;
  }
}
