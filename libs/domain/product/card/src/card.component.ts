import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import {
  ProductContext,
  ProductMediaContainerSize,
  ProductMixin,
} from '@spryker-oryx/product';
import { RouteType } from '@spryker-oryx/router';
import { LinkService } from '@spryker-oryx/site';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import {
  Size,
  computed,
  elementEffect,
  hydrate,
  ssrShim,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { ProductPriceOptions } from '../../price/src/price.model.js';
import { ProductTitleOptions } from '../../title/src/title.model.js';
import { ProductCardOptions } from './card.model';
import { ProductCardStyles } from './card.styles';

@defaultOptions({
  template: 'grid',
  enableTitle: true,
  enableMedia: true,
  enablePrice: true,
  enableWishlist: true,
  enableLabels: true,
  enableRating: true,
  enableAddToCart: true,
})
@ssrShim('style')
@hydrate()
export class ProductCardComponent extends ProductMixin(
  ContentMixin<ProductCardOptions>(LitElement)
) {
  static styles = [ProductCardStyles];

  protected contextController = new ContextController(this);
  protected semanticLinkService = resolve(LinkService);

  @elementEffect()
  protected setTemplate = (): void => {
    this.setAttribute('template', this.$options().template ?? 'grid');
  };

  @elementEffect()
  protected skuController = (): void => {
    const sku = this.$options().sku;
    if (sku !== undefined) {
      this.contextController.provide(ProductContext.SKU, sku);
    }
  };

  @elementEffect()
  protected setProductContext = (): void => {
    if (this.sku) {
      this.contextController.provide(ProductContext.SKU, this.sku);
    }
  };

  protected override render(): TemplateResult | void {
    const { template } = this.$options();

    if (template === 'grid') return this.renderGridItem();
    if (template === 'list') return this.renderListItem();
  }

  protected renderGridItem(): TemplateResult | void {
    const product = this.$product();
    if (!product) return;
    return html`<a href=${this.$link()} aria-label=${product?.name}>
      ${[this.renderLabels(), this.renderMedia()]}
      <div class="details">
        ${[
          this.renderTitle(),
          this.renderRating(),
          this.renderPrice(),
          this.renderAddToCart(),
        ]}
      </div>
    </a>`;
  }

  protected $link = computed(() =>
    this.semanticLinkService.get({
      type: RouteType.Product,
      id: this.$product()?.sku,
    })
  );
  protected renderListItem(): TemplateResult {
    const product = this.$product();

    return html`<a
      href=${this.$link()}
      aria-label=${product?.name}
      template="list"
    >
      ${[
        this.renderMedia(ProductMediaContainerSize.Icon),
        this.renderTitle(),
        this.renderPrice(),
        this.renderAddToCart(),
      ]}
    </a>`;
  }

  protected renderLabels(): TemplateResult | void {
    if (this.$options().enableLabels) {
      return html`<oryx-product-labels></oryx-product-labels>`;
    }
  }

  // TODO: move to wishlist component
  // private renderWishlist(): TemplateResult | void {
  //   if (this.$options().enableWishlist) {
  //     return html`<div class="actions">
  //       <oryx-button
  //          .type=${ButtonType.Icon} .icon=${IconTypes.Wishlist}
  //          @click=${(e: Event) => e.preventDefault()}>
  //       </oryx-icon-button>
  //     </div>`;
  //   }
  // }

  protected renderMedia(
    containerSize = ProductMediaContainerSize.Thumbnail
  ): TemplateResult | void {
    if (this.$options().enableMedia) {
      return html`
        <oryx-product-media
          .options=${{
            containerSize,
          }}
        ></oryx-product-media>
      `;
    }
  }

  protected renderTitle(): TemplateResult | void {
    if (this.$options().enableTitle) {
      return html`<oryx-product-title
        .options="${{ tag: HeadingTag.Caption } as ProductTitleOptions}"
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
        .options=${{ enableTaxMessage: false } as ProductPriceOptions}
      ></oryx-product-price>`;
    }
  }

  protected renderAddToCart(): TemplateResult | void {
    const { enableAddToCart, template } = this.$options();
    if (!enableAddToCart) return;

    return html`<oryx-cart-add
      tabindex="-1"
      .options=${{
        outlined: true,
        hideQuantityInput: true,
        enableLabel: template === 'grid',
      }}
    ></oryx-cart-add>`;
  }
}
