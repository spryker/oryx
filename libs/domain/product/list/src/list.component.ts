import { resolve } from '@spryker-oryx/di';
import { ContentMixin, LayoutMixin } from '@spryker-oryx/experience';
import {
  ProductListPageService,
  ProductListQualifier,
  ProductListService,
} from '@spryker-oryx/product';
import { computed, hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ProductListOptions } from './list.model';

@hydratable()
export class ProductListComponent extends LayoutMixin(
  ContentMixin<ProductListOptions>(LitElement)
) {
  protected productListService = resolve(ProductListService);
  protected productListPageService = resolve(ProductListPageService);

  protected $list = computed(() => {
    const params = this.searchParams();
    return params
      ? this.productListService.get(params)
      : this.productListPageService.get();
  });

  protected override render(): TemplateResult {
    return html`
      ${repeat(
        this.$list()?.products || [],
        (p) => p.sku,
        (p) => html`<oryx-product-card .sku=${p.sku}></oryx-product-card>`
      )}
      ${unsafeHTML(`<style>${this.layoutStyles()}</style>`)}
    `;
  }

  protected searchParams = computed(() => {
    const options = this.$options();

    const p: (keyof ProductListQualifier)[] = [
      'q',
      'page',
      'maxPrice',
      'minPrice',
      'minRating',
      'ipp',
      'brand',
      'label',
      'weight',
      'color',
      'category',
      'sort',
      'storageCapacity',
      'currency',
    ];

    const params = p.reduce(
      (
        params: Record<string | number, string>,
        key: keyof ProductListQualifier
      ) => {
        if (options[key]) {
          params[key] = options[key] as string;
        }
        return params;
      },
      {}
    );

    return Object.keys(params).length ? params : undefined;
  });
}
