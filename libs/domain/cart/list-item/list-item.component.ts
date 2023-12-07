import { CartComponentMixin, CartService, PriceMode } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { AlertType } from '@spryker-oryx/ui';
import { I18nMixin, Size } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { CartListItemProperties } from './list-item.model';
import { cartListItemStyles } from './list-item.styles';

const size = Size.Md;

export class CartListItemComponent
  extends CartComponentMixin(I18nMixin(LitElement))
  implements CartListItemProperties
{
  static styles = cartListItemStyles;

  protected cartService = resolve(CartService);

  @property({ type: Boolean, reflect: true }) open?: boolean;

  protected setDefault(): void {
    this.cartService
      .updateCart({
        cartId: this.$cart()?.id,
        isDefault: true,
      })
      .subscribe();
  }

  protected override render(): TemplateResult | void {
    const cart = this.$cart();

    if (!cart) return;

    return html`
      <oryx-collapsible ?open=${this.open}>
        ${this.renderHeading()} ${this.renderEntries()} ${this.renderControls()}
      </oryx-collapsible>
    `;
  }

  protected renderHeading(): TemplateResult {
    const cart = this.$cart()!;
    //TODO: use link service or content link
    const url = `/my-account/carts/${cart.id}`;

    return html`
      <oryx-link slot="heading">
        <a href=${url}>
          ${cart.name}
          ${this.i18n('carts.totals.<count>-items', {
            count: this.$totalQuantity() ?? 0,
          })}
        </a>
      </oryx-link>
      ${when(
        cart.isDefault,
        () =>
          html`<oryx-chip slot="heading" .appearance=${AlertType.Success}>
            ${this.i18n('default')}
          </oryx-chip>`
      )}

      <oryx-site-price
        slot="heading"
        .value=${cart.totals?.priceToPay ?? 0}
        .currency=${cart.currency}
      ></oryx-site-price>

      <span slot="heading"
        >(
        ${this.i18n(
          cart.priceMode === PriceMode.GrossMode
            ? 'cart.mode.gross'
            : 'cart.mode.net'
        )}
        )</span
      >
    `;
  }

  protected renderControls(): TemplateResult {
    const disabled = !this.$totalQuantity();

    return html`
      <div class="meta">
        ${when(
          !this.$cart()?.isDefault,
          () =>
            html`<oryx-button
              type="outline"
              size=${size}
              @click=${this.setDefault}
            >
              ${this.i18n('carts.make-default')}
            </oryx-button>`
        )}

        <div class="actions">
          <oryx-button icon="edit" type="icon" .size=${size}></oryx-button>
          <oryx-button
            icon="content_copy"
            type="icon"
            .size=${size}
            ?disabled=${!disabled}
          ></oryx-button>
          <oryx-button
            icon="playlist_add"
            type="icon"
            .size=${size}
            ?disabled=${!disabled}
          ></oryx-button>
          <oryx-button icon="share" type="icon" .size=${size}></oryx-button>
          <oryx-button
            icon="download"
            type="icon"
            .size=${size}
            ?disabled=${!disabled}
          ></oryx-button>
          <oryx-button icon="delete" type="icon" .size=${size}></oryx-button>
        </div>
      </div>
    `;
  }

  protected renderEntries(): TemplateResult {
    if (!this.$totalQuantity()) {
      return html`<p>${this.i18n('carts.list.no-cart-entries')}</p>`;
    }

    return html`<oryx-cart-entries
      cartId=${this.$cart()!.id}
    ></oryx-cart-entries>`;
  }
}
