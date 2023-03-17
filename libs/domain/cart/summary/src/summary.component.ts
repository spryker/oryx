import { CartComponentMixin, CartController } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { ContentController } from '@spryker-oryx/experience';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import {
  asyncState,
  hydratable,
  i18n,
  valueType,
} from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { combineLatest, map } from 'rxjs';
import { CartSummaryOptions } from './summary.model';
import { styles } from './summary.styles';

@hydratable('window:load')
export class CartSummaryComponent extends CartComponentMixin<CartSummaryOptions>() {
  static styles = styles;

  protected contentController = new ContentController(this);
  protected cartController = new CartController(this);

  @asyncState()
  protected link = valueType(
    resolve(SemanticLinkService).get({ type: SemanticLinkType.Cart })
  );

  protected quantity$ = combineLatest([
    this.cartController.getTotalQuantity(),
    this.contentController.getOptions(),
  ]).pipe(
    map(([quantity, options]) => this.populateQuantity(quantity, options))
  );

  @asyncState()
  protected quantity = valueType(this.quantity$);

  protected override render(): TemplateResult {
    return html`
      <oryx-menu-item>
        <oryx-menu-item-button 
          slot="trigger"
          icon="cart"
          .url=${this.link}
        >
          ${when(this.quantity, () => html`<mark>${this.quantity}</mark>`)}
          <span slot="text">${i18n(['cart', 'cart.summary.heading'])}</span>
        </oryx-menu-item-button>
      </oryx-menu-item>
    `;
  }

  protected populateQuantity(
    quantity: number | null,
    options: CartSummaryOptions
  ): string | number {
    return quantity &&
      options.maxVisibleQuantity &&
      quantity > options.maxVisibleQuantity
      ? `${options.maxVisibleQuantity}+`
      : Number(quantity);
  }
}
