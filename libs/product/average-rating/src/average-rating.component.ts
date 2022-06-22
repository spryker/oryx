import { hydratable } from '@spryker-oryx/core';
import {
  ContentComponentProperties,
  ContentController,
} from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import {
  Product,
  ProductComponentProperties,
  ProductController,
} from '@spryker-oryx/product';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { combineLatest, map } from 'rxjs';
import { ProductAverageRatingModel } from './average-rating.model';

// TODO: add unit tests
@hydratable()
export class ProductAverageRatingComponent
  extends LitElement
  implements
    ProductComponentProperties,
    ContentComponentProperties<ProductAverageRatingModel>
{
  @property() sku?: string;
  @property() uid?: string;
  @property({ type: Object }) content?: ProductAverageRatingModel;
  @property({ type: Object }) product?: Product;

  protected productController = new ProductController(this);
  protected contentController = new ContentController(this);
  protected product$ = this.productController.getProduct();
  protected content$ = this.contentController.getContent();

  protected rating$ = combineLatest([this.product$, this.content$]).pipe(
    map(([product, contents]) => {
      const reviewCount = contents?.hideReviewCount
        ? undefined
        : product?.reviewCount;
      return {
        rating: product?.averageRating,
        reviewCount,
      };
    })
  );

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(this.rating$, ({ rating, reviewCount }) => {
        return html`
          <oryx-rating
            readonly
            .value=${Number(rating)}
            .reviewCount=${reviewCount}
          ></oryx-rating>
        `;
      })}
    `;
  }
}
