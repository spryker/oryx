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

@hydratable()
export class ProductAverageRatingComponent extends ProductComponentMixin<ProductAverageRatingModel>() {
  protected product$ = new ProductController(this).getProduct();
  protected content$ = new ContentController(this).getContent();

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
            .value=${Number(rating ?? 0)}
            .reviewCount=${reviewCount}
          ></oryx-rating>
        `;
      })}
    `;
  }
}
