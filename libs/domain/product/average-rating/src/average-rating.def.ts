import { componentDef } from '@spryker-oryx/utilities';
import { ProductAverageRatingOptions } from './average-rating.model';

declare global {
  interface FeatureOptions {
    'oryx-product-average-rating'?: ProductAverageRatingOptions;
  }
}

export const productAverageRatingComponent = componentDef({
  name: 'oryx-product-average-rating',
  impl: () =>
    import('./average-rating.component').then(
      (m) => m.ProductAverageRatingComponent
    ),
  schema: () =>
    import('./average-rating.schema').then((m) => m.productAverageRatingSchema),
});
