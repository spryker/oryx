import { hydratable } from '@spryker-oryx/core';
import { ContentController } from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import {
  ProductComponentMixin,
  ProductController,
} from '@spryker-oryx/product';
import { html, TemplateResult } from 'lit';
import { combineLatest, map } from 'rxjs';
import { ProductAverageRatingModel } from './average-rating.model';

// TODO: add unit tests
@hydratable()
export class ProductAverageRatingComponent extends ProductComponentMixin<ProductAverageRatingModel>() {
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
