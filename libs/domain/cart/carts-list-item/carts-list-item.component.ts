import { CartComponentMixin, CartService, PriceMode } from '@spryker-oryx/cart';
import { I18nMixin, Size } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { when } from 'lit/directives/when.js';
import { cartsListItemStyles } from './carts-list-item.styles';
import { resolve } from '@spryker-oryx/di';

const size = Size.Md;

export class CartsListItemComponent extends CartComponentMixin(I18nMixin(LitElement)) {
  static styles = cartsListItemStyles;

  protected cartService = resolve(CartService);

  protected setDefault(): void {
    this.cartService.setDefaultCart({cartId: this.$cart()!.id}).subscribe();
  }

  protected override render(): TemplateResult | void {
    const cart = this.$cart();

    if (!cart) return;

    const totalQuantity = this.$totalQuantity() ?? 0;

    return html`
      <oryx-collapsible>
        <oryx-link slot="heading">
          ${cart.name}
          ${this.i18n('carts.cart.totals.<count>-items', {
            count: totalQuantity,
          })}
        </oryx-link>
        ${when(
          cart.isDefault,
          () =>
            html`<oryx-chip slot="heading" appearance="success">
              ${this.i18n('default')}
            </oryx-chip>`
        )}

        <oryx-site-price
          slot="heading"
          .value=${cart.totals?.priceToPay ?? 0}
          .currency=${cart.currency}
        ></oryx-site-price>

        <span slot="heading">(
          ${this.i18n(
            cart.priceMode === PriceMode.GrossMode
              ? 'carts.mode.gross'
              : 'carts.mode.net'
          )}
        )</span>
        
        ${when(
          !totalQuantity,
          () =>
            html`<p>${this.i18n('carts.list.no-cart-entries')}</p>`,
          () => html`
            <oryx-cart-entries
              .cartId=${cart.id}
              .options=${{ readonly: false }}
            ></oryx-cart-entries>
          `
        )}

        <div class="meta">
          ${when(
            cart.isDefault,
            () =>
              html`<oryx-button 
                type="outline" 
                .size=${size}
                @click=${this.setDefault}
              >
                ${this.i18n('carts.make-default')}
              </oryx-button>`
          )}

          <div class="actions">
            <oryx-button
              icon="edit"
              type="icon"
              .size=${size}
            ></oryx-button>
            <oryx-button
              icon="content_copy"
              type="icon"
              .size=${size}
              ?disabled=${!totalQuantity}
            ></oryx-button>
            <oryx-button
              icon="playlist_add"
              type="icon"
              .size=${size}
              ?disabled=${!totalQuantity}
            ></oryx-button>
            <oryx-button
              icon="share"
              type="icon"
              .size=${size}
            ></oryx-button>
            <oryx-button
              icon="download"
              type="icon"
              .size=${size}
              ?disabled=${!totalQuantity}
            ></oryx-button>
            <oryx-button
              icon="delete"
              type="icon"
              .size=${size}
            ></oryx-button>
          </div>
        </div>
      </oryx-collapsible>
    `;
  }
}
