import { componentDef } from '@spryker-oryx/core';
import { ProductDescriptionOptions } from './description.model';

declare global {
  interface FeatureOptions {
    'oryx-product-description'?: ProductDescriptionOptions;
  }
}

export const productDescriptionComponent = componentDef({
  name: 'oryx-product-description',
  impl: () =>
    import('./description.component').then(
      (m) => m.ProductDescriptionComponent
    ),
});
