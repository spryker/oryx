import { ContentController } from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { ProductComponentMixin } from '@spryker-oryx/product';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { combineLatest } from 'rxjs';
import { ProductPriceController } from './price.controller';
import { ProductPriceContent } from './price.model';
import { ProductPriceStyles } from './price.styles';

export class ProductPriceComponent extends ProductComponentMixin<ProductPriceContent>() {
  static styles = ProductPriceStyles;

  protected contentController = new ContentController(this);
  protected priceController = new ProductPriceController(this);

  protected price$ = combineLatest([
    this.contentController.getContent(),
    this.priceController.price$,
  ]);

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(
        this.price$,
        ([content, price]) => html`
          ${price.defaultPrice?.formattedPrice}
          ${when(
            content?.original && price.originalPrice,
            () =>
              html`<span class="original"
                >${price.originalPrice?.formattedPrice}</span
              >`
          )}
        `
      )}
    `;
  }
}
