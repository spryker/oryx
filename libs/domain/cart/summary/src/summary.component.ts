import { CartComponentMixin, CartController } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { ContentController } from '@spryker-oryx/experience';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { asyncValue, hydratable, i18n } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { combineLatest, map } from 'rxjs';
import { CartSummaryOptions } from './summary.model';
import { styles } from './summary.styles';

@hydratable('window:load')
export class CartSummaryComponent extends CartComponentMixin<CartSummaryOptions>() {
  static styles = styles;

  protected contentController = new ContentController(this);
  protected cartController = new CartController(this);

  protected link = resolve(SemanticLinkService).get({
    type: SemanticLinkType.Cart,
  });

  protected quantity$ = combineLatest([
    this.cartController.getTotalQuantity(),
    this.contentController.getOptions(),
  ]).pipe(
    map(([quantity, options]) => this.populateQuantity(quantity, options))
  );

  protected override render(): TemplateResult {
    return html`
      <oryx-button>
        <a href=${asyncValue(this.link)}>
          <oryx-icon type="cart"></oryx-icon>
          ${asyncValue(this.quantity$, (quantity) =>
            quantity === 0 ? html`` : html`<mark>${quantity}</mark>`
          )}
          <oryx-heading
            tag=${HeadingTag.Subtitle}
            .maxLines=${1}
            sm-appearance="none"
          >
            ${i18n('cart.cart')}
          </oryx-heading>
        </a>
      </oryx-button>
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
