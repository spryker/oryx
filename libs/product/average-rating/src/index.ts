import { componentDef } from '@spryker-oryx/core';

export * from './average-rating.component';
export * from './average-rating.model';

export const productAverageRatingComponent = componentDef({
  name: 'product-average-rating',
  impl: () =>
    import('./average-rating.component').then(
      (m) => m.ProductAverageRatingComponent
    ),
});
