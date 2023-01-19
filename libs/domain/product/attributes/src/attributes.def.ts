import { componentDef } from '@spryker-oryx/core';
import { ProductAttributesComponentOptions } from './attributes.model';

declare global {
  interface FeatureOptions {
    'product-attributes'?: ProductAttributesComponentOptions;
  }
}

export const productAttributesComponent = componentDef({
  name: 'product-attributes',
  impl: () =>
    import('./attributes.component').then((m) => m.ProductAttributesComponent),
});
