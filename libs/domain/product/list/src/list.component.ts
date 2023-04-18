import { resolve } from '@spryker-oryx/di';
import { ContentMixin, StyleRuleSet } from '@spryker-oryx/experience';
import {
  ProductListPageService,
  ProductListQualifier,
  ProductListService,
} from '@spryker-oryx/product';
import { computed, hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ProductListOptions } from './list.model';
import { baseStyles } from './list.styles';

@hydratable()
export class ProductListComponent extends ContentMixin<ProductListOptions>(
  LitElement
) {
  static styles = [baseStyles];

  protected productListService = resolve(ProductListService);
  protected productListPageService = resolve(ProductListPageService);

  protected list = computed(() => {
    const params = this.searchParams();
    return params
      ? this.productListService.get(params)
      : this.productListPageService.get();
  });

  protected override render(): TemplateResult {
    const hasLayout = !!(this.$options() as any as { rules: StyleRuleSet[] })
      ?.rules?.[0]?.layout;
    return hasLayout
      ? html`
          <oryx-layout .uid=${this.uid}>${this.renderProducts()}</oryx-layout>
        `
      : this.renderProducts();
  }

  protected renderProducts(): TemplateResult {
    return html`${this.list()?.products?.map(
      (p) => html`<oryx-product-card .sku=${p.sku}></oryx-product-card>`
    )}`;
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
