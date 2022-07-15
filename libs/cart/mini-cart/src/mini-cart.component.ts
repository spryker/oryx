import { hydratable } from '@spryker-oryx/core';
import { ContentController } from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { html, TemplateResult } from 'lit';
import { combineLatest, map } from 'rxjs';
import { CartController } from '../../src/controllers/cart.controller';
import { CartComponentMixin } from '../../src/mixins/cart.mixin';
import { MiniCartOptions } from './mini-cart.model';
import { styles } from './mini-cart.styles';

@hydratable()
export class MiniCartComponent extends CartComponentMixin<MiniCartOptions>() {
  static styles = styles;

  protected contentController = new ContentController(this);
  protected cartController = new CartController();

  protected maxVisibleQuantity = 99;

  protected quantity$ = combineLatest([
    this.cartController.getTotalItemsQuantity(),
    this.contentController.getOptions(),
  ]).pipe(
    map(([cartQuantity, options]) => {
      return options.quantity ?? cartQuantity;
    })
  );

  protected override render(): TemplateResult {
    return html`
      <a href="/cart">
        <oryx-icon type="cart"></oryx-icon>
        <div class="badge">
          ${asyncValue(
            this.quantity$,
            (quantity) =>
              html`
                ${quantity > this.maxVisibleQuantity
                  ? `${this.maxVisibleQuantity}+`
                  : quantity}
              `,
            () => html`0`
          )}
        </div>
        <span>Cart</span>
      </button>
    `;
  }
}
