import { ContentController } from '@spryker-oryx/experience';
import {
  Product,
  ProductComponentMixin,
  ProductController,
} from '@spryker-oryx/product';
import { SemanticLinkType } from '@spryker-oryx/site';
import { hydratable } from '@spryker-oryx/utilities';
import { asyncValue } from '@spryker-oryx/utilities/lit-rxjs';
import { TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { html } from 'lit/static-html.js';
import { combineLatest } from 'rxjs';
import { ProductTitleOptions } from './title.model';
import { styles } from './title.styles';

@hydratable()
export class ProductTitleComponent extends ProductComponentMixin<ProductTitleOptions>() {
  static styles = styles;

  protected product$ = new ProductController(this).getProduct();
  protected options$ = new ContentController(this).getOptions();

  protected override render(): TemplateResult {
    return html` ${asyncValue(
      combineLatest([this.options$, this.product$]),
      ([options, product]) =>
        html`<oryx-heading .tag=${options.tag} .maxLines=${options.maxLines}>
          ${when(
            !options?.link,
            () => html`${product?.name}`,
            () => this.renderLink(product)
          )}
        </oryx-heading>`
    )}`;
  }

  protected renderLink(product: Product | null): TemplateResult {
    return html`
      <content-link
        .options="${{
          type: SemanticLinkType.Product,
          id: product?.sku,
        }}"
        >${product?.name}</content-link
      >
    `;
  }
}
