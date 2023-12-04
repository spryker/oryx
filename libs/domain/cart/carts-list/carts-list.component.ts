import { CartService } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { cartsListStyles } from './carts-list.styles';
import { repeat } from 'lit/directives/repeat.js';

export class CartsListComponent extends ContentMixin(LitElement) {
  static styles = cartsListStyles;
  protected cartService = resolve(CartService);
  protected $carts = signal(this.cartService.getCarts());

  protected override render(): TemplateResult | void {
    const carts = this.$carts();

    return html`
      <section>
        <h1>
          ${this.i18n(
            'carts.totals.<count>-items',
            { count: carts?.length ?? 0 }
          )}
        </h1>
        <oryx-button type="text" href="/create-cart">
          ${this.i18n('carts.create-cart')}
        </oryx-button>
      </section>
      <p>${this.i18n('carts.list.note')}</p>

      ${repeat(
        carts ?? [],
        ({id}) => id,
        ({id}) => html`<oryx-carts-list-item .cartId=${id}></oryx-carts-list-item>`
      )}
    `;
  }
}
