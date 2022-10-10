import { CartComponentMixin, CartController } from '@spryker-oryx/cart';
import { ContentController } from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { hydratable } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { combineLatest, map } from 'rxjs';
import { MiniCartOptions } from './mini-cart.model';
import { styles } from './mini-cart.styles';

@hydratable('window:load')
export class MiniCartComponent extends CartComponentMixin<MiniCartOptions>() {
  static styles = styles;

  protected contentController = new ContentController(this);
  protected cartController = new CartController(this);

  protected maxVisibleQuantity = 99;

  protected quantity$ = combineLatest([
    this.cartController.getTotalQuantity(),
    this.contentController.getOptions(),
  ]).pipe(
    map(([cartQuantity, options]) => {
      return options.quantity ?? cartQuantity;
    })
  );

  protected override render(): TemplateResult {
    return html`
      <a href="/cart">
        ${asyncValue(
          this.quantity$,
          (quantity) =>
            html`${when(
              quantity,
              () => html`
                <div class="badge">
                  ${Number(quantity) > this.maxVisibleQuantity
                    ? `${this.maxVisibleQuantity}+`
                    : quantity}
                </div>
              `
            )} `
        )}
        <oryx-icon type="cart"></oryx-icon>
        <span>Cart</span>
      </a>
    `;
  }
}
