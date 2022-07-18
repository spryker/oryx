import { ContentController } from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { ProductComponentMixin } from '@spryker-oryx/product';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { combineLatest } from 'rxjs';
import { ProductPriceController } from './price.controller';
import { FormattedProductPrice, ProductPriceOptions } from './price.model';
import { ProductPriceStyles } from './price.styles';

export class ProductPriceComponent extends ProductComponentMixin<ProductPriceOptions>() {
  static styles = ProductPriceStyles;

  protected options$ = new ContentController(this).getOptions();
  protected price$ = new ProductPriceController(this).price$;

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(
        combineLatest([this.options$, this.price$]),
        this.renderPrice
      )}
    `;
  }

  protected renderPrice([options, price]: [
    Partial<ProductPriceOptions> | undefined,
    FormattedProductPrice
  ]): TemplateResult {
    return html`
      ${price.defaultPrice?.formattedPrice}
      ${when(
        !options?.hideOriginal && price.originalPrice,
        () =>
          html`<span class="original">
            ${price.originalPrice?.formattedPrice}
          </span>`
      )}
    `;
  }
}
