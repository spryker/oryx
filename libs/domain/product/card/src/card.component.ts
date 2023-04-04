import { ContextController } from '@spryker-oryx/core';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductMediaContainerSize, ProductMixin } from '@spryker-oryx/product';
import { SemanticLinkType } from '@spryker-oryx/site';
import { Size } from '@spryker-oryx/ui';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { hydratable, ssrShim } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { ProductCardOptions } from './card.model';
import { ProductCardStyles } from './card.styles';

@defaultOptions({
  enableTitle: true,
  titleLineClamp: 1,
  enableMedia: true,
  enablePrice: true,
  enableWishlist: true,
  enableLabels: true,
  enableRating: true,
  enableAddToCart: true,
})
@ssrShim('style')
@hydratable(['mouseover', 'focusin'])
export class ProductCardComponent extends ProductMixin(
  ContentMixin<ProductCardOptions>(LitElement)
) {
  static styles = [ProductCardStyles];

  protected context = new ContextController(this);

  protected override render(): TemplateResult | void {
    const product = this.$product();
    if (!product) return;

    const { titleLineClamp } = this.$options();
    const style = titleLineClamp
      ? `--oryx-product-title-max-lines:${titleLineClamp}`
      : undefined;
    return html`<oryx-content-link
      .options=${{
        type: SemanticLinkType.Product,
        id: product.sku,
        multiLine: true,
        label: product.name,
      }}
    >
      ${this.renderLabels()} ${this.renderWishlist()} ${this.renderMedia()}
      <div
        class="popover"
        ?has-line-clamp=${titleLineClamp}
        style=${ifDefined(style)}
      >
        ${this.renderTitle()}
      </div>
      ${this.renderRating()} ${this.renderPrice()} ${this.renderAddToCart()}
    </oryx-content-link>`;
  }

  protected renderLabels(): TemplateResult | void {
    if (this.$options().enableLabels) {
      return html`<oryx-product-labels></oryx-product-labels>`;
    }
  }

  // TODO: move to wishlist component
  protected renderWishlist(): TemplateResult | void {
    if (this.$options().enableWishlist) {
      return html`<div class="actions">
        <oryx-icon-button>
          <button
            tabindex="-1"
            aria-label="add-to-favorites"
            @click=${(e: Event) => e.preventDefault()}
          >
            <oryx-icon type="wishlist"></oryx-icon>
          </button>
        </oryx-icon-button>
      </div>`;
    }
  }

  protected renderMedia(): TemplateResult | void {
    if (this.$options().enableMedia) {
      return html`
        <oryx-product-media
          .options=${{
            containerSize: ProductMediaContainerSize.Thumbnail,
          }}
        ></oryx-product-media>
      `;
    }
  }

  protected renderTitle(): TemplateResult | void {
    if (this.$options().enableTitle) {
      return html`<oryx-product-title
        .options="${{ tag: HeadingTag.Caption }}"
      ></oryx-product-title>`;
    }
  }

  protected renderRating(): TemplateResult | void {
    if (this.$options().enableRating) {
      return html`<oryx-product-average-rating
        .options=${{ size: Size.Sm, enableCount: false }}
      ></oryx-product-average-rating>`;
    }
  }

  protected renderPrice(): TemplateResult | void {
    if (this.$options().enablePrice) {
      return html`<oryx-product-price
        .options=${{ enableVatMessage: false }}
      ></oryx-product-price>`;
    }
  }

  protected renderAddToCart(): TemplateResult | void {
    if (this.$options().enableAddToCart) {
      return html`<oryx-cart-add
        tabindex="-1"
        .options="${{
          outlined: true,
          hideQuantityInput: true,
        }}"
      ></oryx-cart-add>`;
    }
  }
}
