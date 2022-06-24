import { ContentController } from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { ProductComponentMixin } from '@spryker-oryx/product';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { combineLatest } from 'rxjs';
import { ProductPriceController } from './price.controller';
import { FormattedProductPrice, ProductPriceContent } from './price.model';
import { ProductPriceStyles } from './price.styles';

export class ProductPriceComponent extends ProductComponentMixin<ProductPriceContent>() {
  static styles = ProductPriceStyles;

  protected content$ = new ContentController(this).getContent();
  protected price$ = new ProductPriceController(this).price$;

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(
        combineLatest([this.content$, this.price$]),
        this.renderPrice
      )}
    `;
  }

  protected renderPrice([content, price]: [
    ProductPriceContent | undefined,
    FormattedProductPrice
  ]): TemplateResult {
    return html`
      ${price.defaultPrice?.formattedPrice}
      ${when(
        content?.showOriginal && price.originalPrice,
        () =>
          html`<span class="original">
            ${price.originalPrice?.formattedPrice}
          </span>`
      )}
    `;
  }
}
