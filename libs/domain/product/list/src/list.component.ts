import { resolve } from '@spryker-oryx/di';
import {
  ContentMixin,
  LayoutBuilder,
  StyleRuleSet,
} from '@spryker-oryx/experience';
import {
  ProductListPageService,
  ProductListQualifier,
  ProductListService,
} from '@spryker-oryx/product';
import { computed, hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { ProductListOptions } from './list.model';
import { baseStyles } from './list.styles';

@hydratable()
export class ProductListComponent extends ContentMixin<ProductListOptions>(
  LitElement
) {
  static styles = [baseStyles];

  protected productListService = resolve(ProductListService);
  protected productListPageService = resolve(ProductListPageService);
  protected layoutBuilder = resolve(LayoutBuilder);

  protected list = computed(() => {
    const params = this.searchParams();
    return params
      ? this.productListService.get(params)
      : this.productListPageService.get();
  });

  protected override render(): TemplateResult {
    const rules = (this.$options() as any as { rules: StyleRuleSet[] }).rules;
    const layout = rules?.find((rule) => !rule.breakpoint)?.layout;
    const smLayout = rules?.find((rule) => rule.breakpoint === 'sm')?.layout;
    const mdLayout = rules?.find((rule) => rule.breakpoint === 'md')?.layout;
    const lgLayout = rules?.find((rule) => rule.breakpoint === 'lg')?.layout;

    const bleed = rules?.find((rule) => !rule.breakpoint)?.bleed;
    const sticky = rules?.find((rule) => !rule.breakpoint)?.sticky;

    return layout || smLayout || mdLayout || lgLayout
      ? html`
          <oryx-layout
            uid=${this.uid}
            .layout=${layout}
            .layoutSm=${smLayout}
            .layoutMd=${mdLayout}
            .layoutLg=${lgLayout}
            ?bleed=${bleed}
            ?sticky=${sticky}
          >
            ${this.renderProducts()}
          </oryx-layout>

          ${this.addStyles(this.uid!, this.$options())}
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

  protected addStyles(id: string, options?: any): TemplateResult | void {
    if (!options) return;
    const styles = this.layoutBuilder.createStylesFromOptions(id, options);
    if (styles) {
      return html`${unsafeHTML(`<style>${styles}</style>`)}`;
    }
  }
}
