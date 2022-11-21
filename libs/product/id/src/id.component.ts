import { ContentController } from '@spryker-oryx/experience';
import {
  ProductComponentMixin,
  ProductController,
} from '@spryker-oryx/product';
import { hydratable } from '@spryker-oryx/utilities';
import { asyncValue } from '@spryker-oryx/utilities/lit-rxjs';
import { TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { combineLatest } from 'rxjs';
import { Props } from './id.model';

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
