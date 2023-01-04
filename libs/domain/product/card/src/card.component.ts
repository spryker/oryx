import { ContextController } from '@spryker-oryx/core';
import { ContentController } from '@spryker-oryx/experience';
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
  ObserveController,
  subscribe,
} from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { combineLatest, filter, tap } from 'rxjs';
import { ProductCardComponentOptions } from './card.model';
import { ProductCardStyles } from './card.styles';

@hydratable(['mouseover', 'focusin'])
export class ProductCardComponent extends ProductComponentMixin<ProductCardComponentOptions>() {
  static styles = ProductCardStyles;

  @property({ type: Boolean, reflect: true, attribute: 'hide-title' })
  protected hideTitle = false;
  @property({ type: Boolean, reflect: true, attribute: 'hide-price' })
  protected hidePrice = false;
  @property({ type: Boolean, reflect: true, attribute: 'hide-rating' })
  protected hideRating = false;

  protected observe = new ObserveController<ProductCardComponent>(this);
  protected context = new ContextController(this);
  protected options$ = new ContentController(this).getOptions().pipe(
    tap((options) => {
      // We have an issue during ssr that don't allow us
      // to use methods of the class
      // ie this.toggleAttribute('hide-title', !!options.hideTitle);
      // Issue happens because component is not defined when code is called

      // this solution uses lit-properties and should be replaced by more
      // convenient in the future
      this.hideTitle = !!options.hideTitle;
      this.hidePrice = !!options.hidePrice;
      this.hideRating = !!options.hideRating;
    })
  );
  protected product$ = new ProductController(this).getProduct();

  protected card$ = combineLatest([this.product$, this.options$]).pipe(
    tap(([product, options]) => {
      if (options && 'truncateTitleAfter' in options) {
        this.style?.setProperty(
          '--oryx-product-card-title-line-clamp',
          String(options.truncateTitleAfter)
        );
      }
    })
  );

  @subscribe()
  protected sku$ = combineLatest([
    this.options$,
    // TODO: investigate issue observe decorator with mixin
    this.observe.get('sku'),
  ]).pipe(
    filter(([options, propSku]) => Boolean(options.sku ?? propSku)),
    tap(([options, propSku]) =>
      this.context.provide(ProductContext.SKU, options.sku ?? propSku)
    )
  );

  protected preventPropagating(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
  }

  protected override render(): TemplateResult {
    return html`${asyncValue(this.card$, ([product, options]) =>
      product
        ? html`
            <content-link
              .options="${{
                type: SemanticLinkType.Product,
                id: product.sku,
              }}"
            >
              <div>
                ${when(
                  !options?.hideLabels,
                  () => html`<product-labels></product-labels>`
                )}
                ${when(
                  !options?.hideFavorites,
                  () => html`
                    <oryx-icon-button>
                      <button
                        tabindex="-1"
                        aria-label="add-to-favorites"
                        @click=${this.preventPropagating}
                      >
                        <oryx-icon type="wishlist"></oryx-icon>
                      </button>
                    </oryx-icon-button>
                  `
                )}

                <product-media
                  .options=${{
                    containerSize: ProductMediaContainerSize.Thumbnail,
                  }}
                ></product-media>
              </div>

              <section>
                ${when(
                  !options?.hideTitle,
                  () => html`
                    <product-title
                      .options="${{ link: false }}"
                    ></product-title>
                  `
                )}

                <div>
                  ${when(
                    !options?.hidePrice,
                    () => html`<product-price></product-price>`
                  )}
                  ${when(
                    !options?.hideRating,
                    () => html`
                      <product-average-rating
                        .options=${{ size: 'small' }}
                      ></product-average-rating>
                    `
                  )}

                  <oryx-cart-add
                    tabindex="-1"
                    .options="${{
                      outlined: true,
                      hideQuantityInput: true,
                    }}"
                    @click=${this.preventPropagating}
                  ></oryx-cart-add>
                </div>
              </section>
            </content-link>
          `
        : html``
    )}`;
  }
}
