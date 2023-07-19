import { componentDef } from '@spryker-oryx/utilities';
import { ProductImagesComponentOptions } from './images.model';

declare global {
  interface FeatureOptions {
    'oryx-product-images'?: ProductImagesComponentOptions;
  }
}

export const productImagesComponent = componentDef({
  name: 'oryx-product-images',
  impl: () =>
    import('./images.component').then((m) => m.ProductImagesComponent),
  schema: () =>
    import('./images.schema').then((m) => m.productImagesComponentSchema),
});
