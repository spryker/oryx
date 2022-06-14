import {
  ContentComponentProperties,
  ContentController,
} from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { ProductComponentProperties } from '@spryker-oryx/product';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { combineLatest } from 'rxjs';
import { ProductPriceController } from './price.controller';
import { ProductPriceContent } from './price.model';
import { ProductPriceStyles } from './price.styles';

export class ProductPriceComponent
  extends LitElement
  implements
    ProductComponentProperties,
    ContentComponentProperties<ProductPriceContent>
{
  static styles = ProductPriceStyles;

  @property() uid?: string;
  @property() sku?: string;
  @property({ type: Object }) content?: ProductPriceContent;

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
