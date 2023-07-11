import { resolve } from '@spryker-oryx/di';
import {
  ProductListPageService,
  ProductListService,
} from '@spryker-oryx/product';
import { hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';

@hydratable()
export class ProductCategoryRelatedListComponent extends LitElement {
  protected productListService = resolve(ProductListService);
  protected productListPageService = resolve(ProductListPageService);

  protected override render(): TemplateResult {
    return html`<oryx-product-list></oryx-product-list>`;
  }
}
