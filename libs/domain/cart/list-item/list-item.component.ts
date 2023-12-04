import { CartComponentMixin, CartService, PriceMode } from '@spryker-oryx/cart';
import { I18nMixin, Size } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { when } from 'lit/directives/when.js';
import { cartListItemStyles } from './list-item.styles';
import { resolve } from '@spryker-oryx/di';
import { CartListItemProperties } from './list-item.model';
import { property } from 'lit/decorators.js';

const size = Size.Md;

export class CartListItemComponent 
  extends CartComponentMixin(I18nMixin(LitElement))
 implements CartListItemProperties {
  static styles = cartListItemStyles;

  protected cartService = resolve(CartService);

  @property({ type: Boolean, reflect: true }) open?: boolean;

  protected setDefault(): void {
    this.cartService.setDefaultCart({cartId: this.$cart()!.id}).subscribe();
  }

  protected override render(): TemplateResult | void {
    const cart = this.$cart();

    if (!cart) return;

    const totalQuantity = this.$totalQuantity() ?? 0;
    //TODO: use link service or content link
    const url = `/my-account/carts/${cart.id}`;

    return html`
      <oryx-collapsible ?open=${this.open}>
        <oryx-link slot="heading">
          <a href=${url}>
            ${cart.name}
            ${this.i18n('cart.cart.totals.<count>-items', {
              count: totalQuantity,
            })}
          </a>
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
              ? 'cart.mode.gross'
              : 'cart.mode.net'
          )}
        )</span>
        
        ${when(
          !totalQuantity,
          () =>
            html`<p>${this.i18n('cart.list.no-cart-entries')}</p>`,
          () => html`
            <oryx-cart-entries
              .cartId=${cart.id}
              .options=${{ readonly: false }}
            ></oryx-cart-entries>
          `
        )}

        <div class="meta">
          ${when(
            !cart.isDefault,
            () =>
              html`<oryx-button 
                type="outline" 
                .size=${size}
                @click=${this.setDefault}
              >
                ${this.i18n('cart.make-default')}
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
