import { componentDef } from '@spryker-oryx/core';
import { ProductAverageRatingModel } from './average-rating.model';

declare global {
  interface Flags {
    'product-average-rating'?: ProductAverageRatingModel;
  }
}

export const productAverageRatingComponent = componentDef({
  name: 'product-average-rating',
  impl: () =>
    import('./average-rating.component').then(
      (m) => m.ProductAverageRatingComponent
    ),
});
