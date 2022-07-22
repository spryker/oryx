import { hydratable } from '@spryker-oryx/core';
import { ContentController } from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import {
  ProductComponentMixin,
  ProductController,
} from '@spryker-oryx/product';
import { TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { combineLatest } from 'rxjs';
import { Props } from './product-id.model';

export const TAG_NAME = 'product-id';

@hydratable()
export class ProductIdComponent extends ProductComponentMixin<Props>() {
  protected product$ = new ProductController(this).getProduct();
  protected options$ = new ContentController(this).getOptions();
  protected data$ = combineLatest([this.options$, this.product$]);

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(
        this.data$,
        ([options, product]) =>
          html`${options.prefix ?? 'SKU'}: ${product?.sku}`
      )}
    `;
  }
}
