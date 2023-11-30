import { ContentMixin } from '@spryker-oryx/experience';
import { Size, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { when } from 'lit/directives/when.js';
import { cartsListStyles } from './carts-list.styles';
import { resolve } from '@spryker-oryx/di';
import { CartService, PriceMode } from '@spryker-oryx/cart';

const size = Size.Md;

export class CartsListComponent extends ContentMixin(LitElement) {
  static styles = cartsListStyles;
  protected cartService = resolve(CartService);
  protected $carts = signal(this.cartService.getCarts());

  protected override render(): TemplateResult | void {
    const carts = this.$carts();

    if (!carts?.length) return;

    return html`
      <div class="heading">
        <h1>
          ${this.i18n(
            carts.length ? 'carts.totals.<count>-items': 'carts.totals.empty', 
            { count: carts.length }
          )}
        </h1>
        <oryx-button type="text" href="/create-cart">
          ${this.i18n('carts.create-cart')}
        </oryx-button>
      </div>
      <p>
        Manage your carts with ease. Create, track, and shop effortlessly. Need
        help? Our support team is here for you. Enjoy your shopping!
      </p>

      ${carts.map(
        (cart) => { 
          const productsCount = cart.products?.length ?? 0;

          return html`
            <oryx-collapsible>
              <oryx-link slot="heading">
                ${cart.name}
                ${when(
                  productsCount,
                  () => html`(${this.i18n('carts.cart.totals.<count>-items', {
                    count: productsCount,
                  })})`
                )}
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
                .value=${cart.totals.priceToPay}
                .currency=${cart.currency}
              ></oryx-site-price>
              <span slot="heading">(
                ${this.i18n(cart.priceMode === PriceMode.GrossMode ? 
                  'carts.mode.gross': 
                  'carts.mode.net'
                )}
              )</span>

              ${when(
                !productsCount,
                () =>
                  html`<p>There are no cart entries for this cart available.</p>`,
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
                    html`<oryx-button type="outline" .size=${size}>
                      Make default
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
                    ?disabled=${!productsCount}
                  ></oryx-button>
                  <oryx-button
                    icon="playlist_add"
                    type="icon"
                    .size=${size}
                    ?disabled=${!productsCount}
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
                    ?disabled=${!productsCount}
                  ></oryx-button>
                  <oryx-button
                    icon="delete"
                    type="icon"
                    .size=${size}
                  ></oryx-button>
                </div>
              </div>
            </oryx-collapsible>
          `
        }
      )}
    `;
  }
}
