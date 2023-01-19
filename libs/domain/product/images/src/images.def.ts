import { componentDef } from '@spryker-oryx/core';
import { ProductImagesComponentOptions } from './images.model';

declare global {
  interface FeatureOptions {
    'product-images'?: ProductImagesComponentOptions;
  }
}

export const productImagesComponent = componentDef({
  name: 'product-images',
  impl: () =>
    import('./images.component').then((m) => m.ProductImagesComponent),
});
