import { ContextController } from '@spryker-oryx/core';
import { ContentController } from '@spryker-oryx/experience';
import {
  asyncValue,
  ObserveController,
  subscribe,
} from '@spryker-oryx/lit-rxjs';
import {
  ProductComponentMixin,
  ProductContext,
  ProductController,
} from '@spryker-oryx/product';
import { SemanticLinkType } from '@spryker-oryx/site';
import { isFocusable } from '@spryker-oryx/typescript-utils';
import { html, TemplateResult } from 'lit';
import { combineLatest, filter, tap } from 'rxjs';
import { ProductCardComponentOptions } from './card.model';
import { ProductCardStyles } from './card.styles';

export class ProductCardComponent extends ProductComponentMixin<ProductCardComponentOptions>() {
  static styles = ProductCardStyles;

  protected observe = new ObserveController<ProductCardComponent>(this);
  protected context = new ContextController(this);
  protected options$ = new ContentController(this).getOptions();
  protected product$ = new ProductController(this).getProduct();

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

  protected clickHandler(e: Event): void {
    const target = e.target as HTMLElement;

    if (isFocusable(target)) {
      e.stopPropagation();
    }
  }

  protected override render(): TemplateResult {
    return html`${asyncValue(this.product$, (product) =>
      product
        ? html`
            <content-link
              @click=${this.clickHandler}
              .options="${{
                type: SemanticLinkType.Product,
                id: product.sku,
              }}"
            >
              <product-labels></product-labels>

              <div class="image">
                <product-images
                  .options="${{ hideNavigation: true }}"
                ></product-images>
              </div>
              <div class="info">
                <div class="info-row">
                  <div class="info-col grow1">
                    <product-title
                      .options="${{ singleLine: true }}"
                    ></product-title>
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-col">
                    <product-price></product-price>
                  </div>
                  <div class="info-col">
                    <product-average-rating></product-average-rating>
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-col grow1">
                    <oryx-button type="primary" outline size="medium">
                      <button focusable="false" class="action">View</button>
                    </oryx-button>
                  </div>
                  <div class="info-col">
                    <add-to-cart
                      focusable
                      .options="${{
                        hideQuantityInput: true,
                      }}"
                    ></add-to-cart>
                  </div>
                </div>
              </div>
            </content-link>
          `
        : html``
    )}`;
  }
}
