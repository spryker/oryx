import { resolve } from '@spryker-oryx/di';
import { ContentController } from '@spryker-oryx/experience';
import { layoutStyles } from '@spryker-oryx/experience/composition';
import {
  Product,
  ProductComponentMixin,
  ProductListPageService,
  ProductListQualifier,
  ProductListService,
} from '@spryker-oryx/product';
import { asyncValue } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { map, switchMap } from 'rxjs';
import { baseStyles } from './list.styles';

export class ProductListComponent extends ProductComponentMixin<ProductListQualifier>() {
  static styles = [layoutStyles, baseStyles];

  protected productListService = resolve(ProductListService);
  protected productListPageService = resolve(ProductListPageService);
  protected options$ = new ContentController(this).getOptions();
  protected products$ = this.options$.pipe(
    switchMap((options) => {
      const searchParams = this.productListService.getSearchParams(options);
      return this.hasOptions(searchParams)
        ? this.productListService.get(searchParams)
        : this.productListPageService.get();
    }),
    map((list) => list?.products ?? [])
  );

  protected renderProducts(products: Product[]): TemplateResult {
    return html`${products.map(
      (p) => html`<product-card .sku=${p.sku}></product-card>`
    )}`;
  }

  protected hasOptions(options: ProductListQualifier): boolean {
    return Object.keys(options).some(
      (k) => !!options[k as keyof ProductListQualifier]
    );
  }

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(this.products$, (products) => this.renderProducts(products))}
    `;
  }
}
