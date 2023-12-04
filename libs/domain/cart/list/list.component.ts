import { CartService } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { cartListStyles } from './list.styles';
import { repeat } from 'lit/directives/repeat.js';

export class CartListComponent extends ContentMixin(LitElement) {
  static styles = cartListStyles;
  protected cartService = resolve(CartService);
  protected $carts = signal(this.cartService.getCarts());

  protected override render(): TemplateResult | void {
    const carts = this.$carts();

    return html`
      <section>
        <h1>
          ${this.i18n(
            'cart.totals.<count>-items',
            { count: carts?.length ?? 0 }
          )}
        </h1>
        <oryx-button type="text" href="/create-cart">
          ${this.i18n('cart.create-cart')}
        </oryx-button>
      </section>
      <p>${this.i18n('cart.list.note')}</p>

      ${repeat(
        carts ?? [],
        ({id}) => id,
        ({id}) => html`<oryx-cart-list-item .cartId=${id}></oryx-cart-list-item>`
      )}
    `;
  }
}
