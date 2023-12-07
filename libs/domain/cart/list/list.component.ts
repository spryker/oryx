import { CartService } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, LayoutMixin } from '@spryker-oryx/experience';
import { signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export class CartListComponent extends LayoutMixin(ContentMixin(LitElement)) {
  protected cartService = resolve(CartService);
  protected $carts = signal(this.cartService.getCarts());

  protected override render(): TemplateResult | void {
    const carts = this.$carts();

    // return html`

    // `;

    return this.renderLayout({
      template: html`
        ${repeat(
          carts ?? [],
          ({ id }) => id,
          ({ id }) =>
            html`<oryx-cart-list-item cartId=${id}></oryx-cart-list-item>`
        )}
        ${unsafeHTML(`<style>${this.layoutStyles()}</style>`)}
      `,
    });
  }
}
