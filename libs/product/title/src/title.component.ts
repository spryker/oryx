import { hydratable } from '@spryker-oryx/core';
import { ContentController } from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import {
  Product,
  ProductComponentMixin,
  ProductController,
} from '@spryker-oryx/product';
import { SemanticLinkType } from '@spryker-oryx/site';
import { TemplateResult } from 'lit';
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
        this.renderTitle(this.renderContent(product, options.link), options)
    )}`;
  }

  protected renderContent(
    product: Product | null,
    renderLink = false
  ): TemplateResult {
    if (!renderLink) {
      return html`${product?.name}`;
    }

    return html`
      <content-link
        .options="${{
          type: SemanticLinkType.Product,
          id: product?.sku,
        }}"
      >
        ${product?.name}
      </content-link>
    `;
  }

  /**
   * Generates the TAG (h1 - h6) based on the options.
   *
   * When there's no tag provided, a plain text node is created.   *
   *
   * We'd prefer using `unsafeStatic` directive, however, there's a SSR related issue
   * that blocks us from using this: https://github.com/lit/lit/issues/2246.
   *
   */
  protected renderTitle(
    title: TemplateResult,
    options: ProductTitleOptions
  ): TemplateResult {
    this.toggleAttribute?.('single-line', !!options.singleLine);

    switch (options.tag) {
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
