import { componentDef } from '@spryker-oryx/utilities';
import { ProductAttributesOptions } from './attributes.model';

declare global {
  interface FeatureOptions {
    'oryx-product-attributes'?: ProductAttributesOptions;
  }
}

export const productAttributesComponent = componentDef({
  name: 'oryx-product-attributes',
  impl: () =>
    import('./attributes.component').then((m) => m.ProductAttributesComponent),
  schema: () =>
    import('./attributes.schema').then((m) => m.productAttributesSchema),
});
