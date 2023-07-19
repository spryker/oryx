import { componentDef } from '@spryker-oryx/utilities';
import { BazaarvoiceReviewListOptions } from './review-list.model';

declare global {
  interface FeatureOptions {
    'bv-product-review-list'?: BazaarvoiceReviewListOptions;
  }
}

export const bazaarvoiceProductReviewListComponent = componentDef({
  name: 'bv-product-review-list',
  impl: () =>
    import('./review-list.component').then(
      (m) => m.BazaarvoiceReviewListComponent
    ),
  schema: () =>
    import('./review-list.schema').then((m) => m.reviewListComponentSchema),
});
