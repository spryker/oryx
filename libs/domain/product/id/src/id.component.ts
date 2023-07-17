import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductContext, ProductMixin } from '@spryker-oryx/product';
import { hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { ProductIdOptions } from './id.model';

@defaultOptions({ prefix: 'SKU: ' })
@hydrate({ context: ProductContext.SKU })
export class ProductIdComponent extends ProductMixin(
  ContentMixin<ProductIdOptions>(LitElement)
) {
  protected override render(): TemplateResult {
    return html`<span part="prefix">${this.$options()?.prefix}</span>
      ${this.$product()?.sku}`;
  }
}
