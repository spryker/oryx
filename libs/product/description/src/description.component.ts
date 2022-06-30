import { ContentController } from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import {
  ProductComponentMixin,
  ProductController,
} from '@spryker-oryx/product';
import { TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { html } from 'lit/static-html.js';
import { descriptionStyles } from './description.styles';
import { ProductDescriptionContent } from './model';
import { convertLineFeedsToHTML } from './utils';

export class ProductDescriptionComponent extends ProductComponentMixin<ProductDescriptionContent>() {
  static styles = descriptionStyles;

  protected options$ = new ContentController(this).getOptions();
  protected product$ = new ProductController(this).getProduct();

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(
        this.options$,
        (c) => html`<oryx-text
          .truncateAfter=${c?.truncateAfter ?? 0}
          ?showToggle=${!!c.showToggle}
          ?expanded=${!!c.expanded}
        >
          ${asyncValue(
            this.product$,
            (p) => html`${unsafeHTML(this.convert(p.description))}`
          )}
        </oryx-text>`
      )}
    `;
  }

  protected convert(text?: string): string {
    return convertLineFeedsToHTML(text ?? '');
  }
}
