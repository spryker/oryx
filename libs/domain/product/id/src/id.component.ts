import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductMixin } from '@spryker-oryx/product';
import { hydratable } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { ProductIdOptions } from './id.model';

@defaultOptions({ prefix: 'SKU: ' })
@hydratable(['mouseover', 'focusin'])
export class ProductIdComponent extends ProductMixin(
  ContentMixin<ProductIdOptions>(LitElement)
) {
  protected override render(): TemplateResult {
    return html`${this.componentOptions?.prefix}${this.product?.sku}`;
  }
}
