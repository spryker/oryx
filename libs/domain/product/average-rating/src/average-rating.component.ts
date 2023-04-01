import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductMixin } from '@spryker-oryx/product';
import { Size } from '@spryker-oryx/ui';
import { hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ProductAverageRatingOptions } from './average-rating.model';

@defaultOptions({ enableCount: true, size: Size.Lg })
@hydratable(['mouseover', 'focusin'])
export class ProductAverageRatingComponent extends ProductMixin(
  ContentMixin<ProductAverageRatingOptions>(LitElement)
) {
  protected override render(): TemplateResult | void {
    const reviewCount = this.$options().enableCount
      ? this.$product()?.reviewCount ?? 0
      : undefined;

    return html`
      <oryx-rating
        readonly
        .size=${this.$options().size}
        .value=${this.$product()?.averageRating}
        .reviewCount=${reviewCount}
      ></oryx-rating>
    `;
  }
}
