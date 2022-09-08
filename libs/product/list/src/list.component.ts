import { hydratable } from '@spryker-oryx/core';
import { ContentController } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { Product, ProductComponentMixin } from '@spryker-oryx/product';
import { html, TemplateResult } from 'lit';
import { switchMap } from 'rxjs';

import {
  ProductListPageService,
  ProductListService,
} from '@spryker-oryx/product';
import { map } from 'rxjs';
import { ProductListQualifier } from '../../src/models/product-list-qualifier';

@hydratable()
export class ProductListComponent extends ProductComponentMixin<ProductListQualifier>() {
  protected productListService = resolve(ProductListService);
  protected productListPageService = resolve(ProductListPageService);
  protected options$ = new ContentController(this).getOptions();
  protected products$ = this.options$.pipe(
    switchMap((options) =>
      this.hasOptions(options)
        ? this.productListService.get(options)
        : this.productListPageService.get()
    ),
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
