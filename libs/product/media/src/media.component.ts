import { hydratable } from '@spryker-oryx/core';
import { ContentController } from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import {
  ProductComponentMixin,
  ProductController,
} from '@spryker-oryx/product';
import { html, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { combineLatest, map, Observable } from 'rxjs';
import { ProductMediaComponentOptions } from './media.model';

@hydratable('mouseover')
export class ProductMediaComponent extends ProductComponentMixin<ProductMediaComponentOptions>() {
  protected productController = new ProductController(this);
  protected contentController = new ContentController(this);
  protected product$ = this.productController.getProduct();
  protected options$ = this.contentController.getOptions();

  protected productMedia$: Observable<ProductMediaComponentOptions> =
    combineLatest([this.options$, this.product$]).pipe(
      map(([options, product]) => {
        const src = product?.images?.[0]?.externalUrlSmall;
        const hdSrc = product?.images?.[0]?.externalUrlLarge;
        const alt = product?.name;

        return {
          src,
          hdSrc,
          alt,
          loading: 'lazy',
          breakpoint: 768,
          ...options,
        };
      })
    );

  protected override render(): TemplateResult {
    return html` ${asyncValue(
      this.productMedia$,
      (options: ProductMediaComponentOptions): TemplateResult => {
        const { src, hdSrc, alt, loading, breakpoint } = options;

        if (!src) {
          return html``;
        }

        return html`
          <oryx-image>
            ${when(
              !!hdSrc,
              () =>
                html`<source
                  media="(min-width: ${breakpoint}px)"
                  srcset=${hdSrc}
                />`
            )}
            <img
              src="${src}"
              alt=${ifDefined(alt)}
              loading="${ifDefined(loading)}"
            />
          </oryx-image>
        `;
      }
    )}`;
  }
}
