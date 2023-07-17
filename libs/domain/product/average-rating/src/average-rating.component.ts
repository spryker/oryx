import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductContext, ProductMixin } from '@spryker-oryx/product';
import { computed, hydrate, Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ProductAverageRatingOptions } from './average-rating.model';

@defaultOptions({ enableCount: true, size: Size.Lg })
@hydrate({ context: ProductContext.SKU })
export class ProductAverageRatingComponent extends ProductMixin(
  ContentMixin<ProductAverageRatingOptions>(LitElement)
) {
  protected $reviewCount = computed(() => {
    if (!this.$options().enableCount) return;
    return this.$product()?.reviewCount ?? 0;
  });

  protected override render(): TemplateResult | void {
    return html`
      <oryx-rating
        readonly
        .size=${this.$options().size}
        .value=${this.$product()?.averageRating}
        .reviewCount=${this.$reviewCount()}
      ></oryx-rating>
    `;
  }
}
