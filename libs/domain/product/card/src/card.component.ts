import { ContextController } from '@spryker-oryx/core';
import { ContentController, defaultOptions } from '@spryker-oryx/experience';
import {
  ProductComponentMixin,
  ProductContext,
  ProductController,
  ProductMediaContainerSize,
} from '@spryker-oryx/product';
import { SemanticLinkType } from '@spryker-oryx/site';
import {
  asyncValue,
  hydratable,
  observe,
  ssrShim,
  subscribe,
} from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { BehaviorSubject, combineLatest, tap } from 'rxjs';
import { ProductCardComponentOptions } from './card.model';
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
export class ProductCardComponent extends ProductComponentMixin<ProductCardComponentOptions>() {
  static styles = ProductCardStyles;

  protected context = new ContextController(this);
  protected product$ = new ProductController(this).getProduct();
  protected options$ = new ContentController(this).getOptions();

  @observe()
  protected sku$ = new BehaviorSubject(this.sku);

  @subscribe()
  protected skuSubscriber$ = combineLatest([this.options$, this.sku$]).pipe(
    tap(([options, propSku]) => {
      this.context.provide(ProductContext.SKU, options.sku ?? propSku);
      if (options.titleLineClamp) {
        this.toggleAttribute('has-line-clamp', true);
        this.style.setProperty(
          '--oryx-product-title-max-lines',
          options.titleLineClamp.toString()
        );
      }
    })
  );

  protected override render(): TemplateResult {
    return html`${asyncValue(this.product$, (product) => {
      if (!product) return html``;

      return html`
        <content-link
          .options="${{
            type: SemanticLinkType.Product,
            id: product.sku,
            multiLine: true,
            label: product.name,
          }}"
        >
          ${asyncValue(
            this.options$,
            (options) => html`
              ${this.renderLabels(options)} ${this.renderWishlist(options)}
              ${this.renderMedia(options)}
              <div class="popover">${this.renderTitle(options)}</div>
              ${this.renderRating(options)} ${this.renderPrice(options)}
              ${this.renderAddToCart(options)}
            `
          )}
        </content-link>
      `;
    })}`;
  }

  protected renderLabels(
    options: ProductCardComponentOptions
  ): TemplateResult | void {
    if (!options.enableLabels) return;

    return html`<product-labels></product-labels>`;
  }

  protected renderMedia(
    options: ProductCardComponentOptions
  ): TemplateResult | void {
    if (!options.enableMedia) return;

    return html`
      <product-media
        .options=${{
          containerSize: ProductMediaContainerSize.Thumbnail,
        }}
      ></product-media>
    `;
  }

  protected renderWishlist(
    options: ProductCardComponentOptions
  ): TemplateResult | void {
    if (!options.enableWishlist) return;

    // TODO: move to wishlist component
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

  protected renderTitle(
    options: ProductCardComponentOptions
  ): TemplateResult | void {
    if (!options.enableTitle) return;

    return html`<product-title
      .options="${{ tag: 'h3', link: false }}"
    ></product-title>`;
  }

  protected renderRating(
    options: ProductCardComponentOptions
  ): TemplateResult | void {
    if (!options.enableRating) return;

    return html`<product-average-rating
      .options=${{ size: 'small' }}
    ></product-average-rating>`;
  }

  protected renderPrice(
    options: ProductCardComponentOptions
  ): TemplateResult | void {
    if (!options.enablePrice) return;

    return html`<product-price></product-price>`;
  }

  protected renderAddToCart(
    options: ProductCardComponentOptions
  ): TemplateResult | void {
    if (!options.enableAddToCart) return;
    return html`<oryx-cart-add
      tabindex="-1"
      .options="${{
        outlined: true,
        hideQuantityInput: true,
      }}"
    ></oryx-cart-add>`;
  }
}
