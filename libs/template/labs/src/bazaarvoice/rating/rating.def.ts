import { componentDef } from '@spryker-oryx/utilities';
import { BazaarvoiceRatingOptions } from './rating.model';

declare global {
  interface FeatureOptions {
    'bv-product-average-rating'?: BazaarvoiceRatingOptions;
  }
}

export const bazaarvoiceProductAverageRatingComponent = componentDef({
  name: 'bv-product-average-rating',
  impl: () =>
    import('./rating.component').then((m) => m.BazaarvoiceRatingComponent),
  schema: () => import('./rating.schema').then((m) => m.ratingComponentSchema),
});
