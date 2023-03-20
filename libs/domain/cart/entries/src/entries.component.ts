import { CartComponentMixin, CartService } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductService } from '@spryker-oryx/product';
import { NotificationService } from '@spryker-oryx/site';
import { AlertType, Size } from '@spryker-oryx/ui';
import {
  asyncState,
  hydratable,
  i18n,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { CartEntryChangeEventDetail } from '../../entry/src';
import { CartEntriesOptions } from './entries.model';
import { cartEntriesStyles } from './entries.styles';

@defaultOptions({
  silentRemove: false,
  removeByQuantity: 'showBin',
  notifyOnUpdate: false,
  notifyOnRemove: true,
} as CartEntriesOptions)
@hydratable('window:load')
export class CartEntriesComponent extends CartComponentMixin(
  ContentMixin<CartEntriesOptions>(LitElement)
) {
  static styles = cartEntriesStyles;

  protected cartService = resolve(CartService);
  protected productService = resolve(ProductService);

  @state() removeGroupKey?: string;

  @asyncState()
  protected activeEntry = valueType(
    this.cartController.getEntry(this.removeGroupKey)
  );

  protected notificationService = resolve(NotificationService);

  // TODO: implement loading state
  protected override render(): TemplateResult | void {
    if (this.isEmpty) {
      return this.renderEmpty();
    }

    return html`
      <oryx-heading>
        <h1>${i18n('cart.totals.<count>-items', { count: 7 })}</h1>
      </oryx-heading>

      ${repeat(
        this.entries ?? [],
        (entry) => entry.groupKey,
        (entry) =>
          html`
              <oryx-cart-entry
                .key=${entry.groupKey}
                @entry.submit=${() => console.log('on submit...')}
                ?readonly=${this.componentOptions.readonly}
              ></<oryx-cart-entry>
            `
      )}
      ${when(this.removeGroupKey, () =>
        this.renderConfirmation(this.removeGroupKey)
      )}
    `;
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
    const { groupKey, quantity } = ev.detail;

    if (ev.detail.quantity === 0) {
      if (this.componentOptions?.silentRemove) {
        this.removeEntry(ev.detail.groupKey);
      } else {
        this.removeGroupKey = ev.detail.groupKey;
      }
    } else {
      this.cartService.updateEntry({ groupKey, quantity }).subscribe(() => {
        if (this.componentOptions.notifyOnUpdate) {
          const sku = this.entries?.find(
            (entry) => entry.groupKey === groupKey
          )?.sku;
          this.notify('cart.cart-entry-updated', sku);
        }
      });
    }
  }

  protected removeEntry(groupKey: string): void {
    this.removeGroupKey = undefined;
    const sku = this.entries?.find((entry) => entry.groupKey === groupKey)?.sku;
    this.cartService.deleteEntry({ groupKey }).subscribe(() => {
      if (this.componentOptions.notifyOnRemove) {
        this.notify('cart.confirm-removed-<item>', sku);
      }
    });
  }

  protected notify(token: string, sku?: string): void {
    this.notificationService.push({
      type: AlertType.Success,
      content: i18n(token) as string,
      subtext: html`<oryx-product-title .sku=${sku}></oryx-product-title>`,
    });
  }

  protected renderConfirmation(groupKey?: string): TemplateResult | void {
    if (!groupKey) return;

    const sku = this.entries?.find((entry) => entry.groupKey === groupKey)?.sku;

    return html`<oryx-modal
      open
      enableFooter
      enableCloseButtonInHeader
      heading=${i18n('cart.entry.confirm')}
      @oryx.close=${this.resetConfirmation}
    >
      ${i18n(`cart.entry.confirm-remove-<sku>`, { sku })}

      <oryx-button
        slot="footer-more"
        type="primary"
        size=${Size.Sm}
        @click=${() => this.removeEntry(groupKey)}
      >
        <button value="remove">${i18n(`cart.entry.remove`)}</button>
      </oryx-button>
    </oryx-modal>`;
  }

  protected resetConfirmation(): void {
    this.removeGroupKey = undefined;
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
