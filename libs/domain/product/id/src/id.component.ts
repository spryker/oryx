import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { PRODUCT, ProductContext, ProductMixin } from '@spryker-oryx/product';
import { featureVersion, hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { ProductIdOptions } from './id.model';

@defaultOptions({ prefix: 'SKU: ' })
@hydrate({ context: featureVersion >= '1.4' ? PRODUCT : ProductContext.SKU })
export class ProductIdComponent extends ProductMixin(
  ContentMixin<ProductIdOptions>(LitElement)
) {
  protected override render(): TemplateResult {
    return html`<span part="prefix">${this.$options()?.prefix}</span>
      ${this.$product()?.sku}`;
  }
}
