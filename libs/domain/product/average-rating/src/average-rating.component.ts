import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductMixin } from '@spryker-oryx/product';
import { Size } from '@spryker-oryx/ui/utilities';
import { hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ProductAverageRatingOptions } from './average-rating.model';

@defaultOptions({ enableCount: true, size: Size.large })
@hydratable()
export class ProductAverageRatingComponent extends ProductMixin(
  ContentMixin<ProductAverageRatingOptions>(LitElement)
) {
  protected override render(): TemplateResult {
    const reviewCount = this.componentOptions?.enableCount
      ? this.product?.reviewCount ?? 0
      : undefined;

    return html`
      <oryx-rating
        readonly
        .size=${this.componentOptions?.size}
        .value=${this.product?.averageRating}
        .reviewCount=${reviewCount}
      ></oryx-rating>
    `;
  }
}
