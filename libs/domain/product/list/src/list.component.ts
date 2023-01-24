import { resolve } from '@spryker-oryx/di';
import { ContentController, StyleRuleSet } from '@spryker-oryx/experience';
import {
  Product,
  ProductComponentMixin,
  ProductListPageService,
  ProductListQualifier,
  ProductListService,
} from '@spryker-oryx/product';
import { asyncValue, ssrShim, subscribe } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { map, switchMap, tap } from 'rxjs';
import { baseStyles } from './list.styles';

@ssrShim('style')
export class ProductListComponent extends ProductComponentMixin<ProductListQualifier>() {
  static styles = [baseStyles];

  protected productListService = resolve(ProductListService);
  protected productListPageService = resolve(ProductListPageService);

  @property({ reflect: true, type: Boolean, attribute: 'has-layout' })
  hasLayout?: boolean;

  @subscribe()
  protected options$ = new ContentController(this).getOptions().pipe(
    tap((options) => {
      this.hasLayout = !!(options as any as { rules: StyleRuleSet[] })
        ?.rules?.[0]?.layout;
    })
  );

  protected products$ = this.options$.pipe(
    switchMap((options) => {
      const searchParams = this.productListService.getSearchParams(options);
      return this.hasOptions(searchParams)
        ? this.productListService.get(searchParams)
        : this.productListPageService.get();
    }),
    map((list) => list?.products ?? [])
  );

  protected hasOptions(options: ProductListQualifier): boolean {
    return Object.keys(options).some(
      (k) => !!options[k as keyof ProductListQualifier]
    );
  }

  protected override render(): TemplateResult {
    return this.hasLayout
      ? html`
          <oryx-layout .uid=${this.uid}>
            ${asyncValue(this.products$, (products) =>
              this.renderProducts(products)
            )}
          </oryx-layout>
        `
      : html` ${asyncValue(this.products$, (products) =>
          this.renderProducts(products)
        )}`;
  }

  protected renderProducts(products: Product[]): TemplateResult {
    return html`${products.map(
      (p) => html`<product-card .sku=${p.sku}></product-card>`
    )}`;
  }
}
