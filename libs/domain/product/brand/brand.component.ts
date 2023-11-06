import { ContentMixin } from '@spryker-oryx/experience';
import { ProductContext, ProductMixin } from '@spryker-oryx/product';
import { computed, hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { ProductBrandOptions } from './brand.model';

@hydrate({ context: ProductContext.SKU })
export class ProductBrandComponent extends ProductMixin(
  ContentMixin<ProductBrandOptions>(LitElement)
) {
  protected $brand = computed(() => {
    return this.$product()?.attributes?.['brand'];
  });

  protected override render(): TemplateResult | void {
    if (!this.$brand()) {
      return;
    }

    return html`<oryx-image .resource=${this.$brand()} skipFallback />`;
  }
}
