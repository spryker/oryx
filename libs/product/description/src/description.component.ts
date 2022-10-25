import { ContentController } from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import {
  ProductComponentMixin,
  ProductController,
} from '@spryker-oryx/product';
import { hydratable } from '@spryker-oryx/utilities';
import { TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { html } from 'lit/static-html.js';
import { ProductDescriptionOptions } from './model';
import { convertLineFeedsToHTML } from './utils';

@hydratable(['mouseover', 'window:resize'])
export class ProductDescriptionComponent extends ProductComponentMixin<ProductDescriptionOptions>() {
  protected options$ = new ContentController(this).getOptions();
  protected product$ = new ProductController(this).getProduct();

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(
        this.options$,
        (options) => html`<oryx-text
          .style=${`--line-clamp: ${options.truncateAfter ?? 0}`}
          .hideToggle=${!!options.hideToggle}
          .defaultExpanded=${!!options.defaultExpanded}
        >
          ${asyncValue(
            this.product$,
            (product) => html`${unsafeHTML(this.convert(product?.description))}`
          )}
        </oryx-text>`
      )}
    `;
  }

  protected convert(text?: string): string {
    return convertLineFeedsToHTML(text ?? '');
  }
}
