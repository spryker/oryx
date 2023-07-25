import { componentDef } from '@spryker-oryx/utilities';
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
  schema: () =>
    import('./description.schema').then((m) => m.productDescriptionSchema),
});
