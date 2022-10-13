import { componentDef } from '@spryker-oryx/core';

export const productAverageRatingComponent = componentDef({
  name: 'product-average-rating',
  impl: () =>
    import('./average-rating.component').then(
      (m) => m.ProductAverageRatingComponent
    ),
});
