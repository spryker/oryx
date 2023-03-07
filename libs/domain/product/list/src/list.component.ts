import { resolve } from '@spryker-oryx/di';
import {
  CompositionProperties,
  ContentController,
  ContentMixin,
  StyleRuleSet,
} from '@spryker-oryx/experience';
import {
  Product,
  ProductListPageService,
  ProductListQualifier,
  ProductListService,
  ProductMixin,
} from '@spryker-oryx/product';
import {
  asyncState,
  ssrShim,
  subscribe,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { map, switchMap, tap } from 'rxjs';
import { baseStyles } from './list.styles';

@ssrShim('style')
export class ProductListComponent extends ProductMixin(
  ContentMixin<ProductListQualifier>(LitElement)
) {
  static styles = [baseStyles];

  protected productListService = resolve(ProductListService);
  protected productListPageService = resolve(ProductListPageService);

  @property({ reflect: true, type: Boolean, attribute: 'has-layout' })
  hasLayout?: boolean;

  @state()
  layoutRules?: StyleRuleSet[];

  @subscribe()
  protected options$ = new ContentController(this).getOptions().pipe(
    tap((options) => {
      this.hasLayout = !!(options as any as { rules: StyleRuleSet[] })
        ?.rules?.[0]?.layout;
      this.layoutRules = (options as CompositionProperties)?.rules;
    })
  );

  @asyncState()
  protected products = valueType(
    this.options$.pipe(
      switchMap((options) => {
        const searchParams = this.productListService.getSearchParams(options);
        return this.hasOptions(searchParams)
          ? this.productListService.get(searchParams)
          : this.productListPageService.get();
      }),
      map((list) => list?.products ?? [])
    )
  );

  protected hasOptions(options: ProductListQualifier): boolean {
    return Object.keys(options).some(
      (k) => !!options[k as keyof ProductListQualifier]
    );
  }

  protected override render(): TemplateResult {
    return this.hasLayout
      ? html`
          <oryx-layout .rules=${this.layoutRules}>
            ${this.renderProducts(this.products)}
          </oryx-layout>
        `
      : html` ${this.renderProducts(this.products)}`;
  }

  protected renderProducts(products: Product[] = []): TemplateResult {
    return html`${products.map(
      (p) => html`<oryx-product-card .sku=${p.sku}></oryx-product-card>`
    )}`;
  }
}
