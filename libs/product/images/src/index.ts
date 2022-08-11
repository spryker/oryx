import { componentDef } from '@spryker-oryx/core';

export * from './images.component';
export * from './images.model';
export * from './images.styles';

export const productImagesComponent = componentDef({
  name: 'product-images',
  impl: () =>
    import('./images.component').then((m) => m.ProductImagesComponent),
});
