import { ContentController } from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import {
  ProductComponentMixin,
  ProductController,
} from '@spryker-oryx/product';
import { hydratable } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { combineLatest, map } from 'rxjs';
import { ProductAverageRatingModel } from './average-rating.model';

@hydratable()
export class ProductAverageRatingComponent extends ProductComponentMixin<ProductAverageRatingModel>() {
  protected product$ = new ProductController(this).getProduct();
  protected options$ = new ContentController(this).getOptions();

  protected rating$ = combineLatest([this.product$, this.options$]).pipe(
    map(([product, options]) => {
      const reviewCount = options?.hideReviewCount
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
            .value=${rating}
            .reviewCount=${reviewCount}
          ></oryx-rating>
        `;
      })}
    `;
  }
}
