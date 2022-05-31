import { hydratable } from '@spryker-oryx/core';
import {
  ContentComponentProperties,
  ContentController,
} from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import {
  ProductComponentProperties,
  ProductController,
} from '@spryker-oryx/product';
import { LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';
import { ProductTitleContent } from './model';
import { styles } from './title.styles';

@hydratable()
export class TitleComponent
  extends LitElement
  implements
    ProductComponentProperties,
    ContentComponentProperties<ProductTitleContent>
{
  static styles = styles;

  @property() sku?: string;
  @property() uid?: string;
  @property({ type: Object }) content?: ProductTitleContent;

  protected product$ = new ProductController(this).product$;
  protected content$ = new ContentController<ProductTitleContent>(this)
    .content$;

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(
        this.content$,
        (content) =>
          html`${this.renderTitle(
            html`
              ${asyncValue(this.product$, (product) => html`${product?.name}`)}
            `,
            content
          )} `
      )}
    `;
  }

  /**
   * Generates the TAG (h1 - h6) based on the content.
   *
   * When there's no tag provided, a plain text node is created.   *
   *
   * We'd prefer using `unsafeStatic` directive, however, there's a SSR related issue
   * that blocks us from using this: https://github.com/lit/lit/issues/2246.
   *
   */
  protected renderTitle(
    title: TemplateResult,
    content: ProductTitleContent
  ): TemplateResult {
    this.toggleAttribute('single-line', content.singleLine);
    switch (content.tag) {
      case 'h1':
        return html`<h1>${title}</h1>`;
      case 'h2':
        return html`<h2>${title}</h2>`;
      case 'h3':
        return html`<h3>${title}</h3>`;
      case 'h4':
        return html`<h4>${title}</h4>`;
      case 'h5':
        return html`<h5>${title}</h5>`;
      case 'h6':
        return html`<h6>${title}</h6>`;
    }
    return title;
  }
}
