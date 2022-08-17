import { componentDef } from '@spryker-oryx/core';

export const productImagesComponent = componentDef({
  name: 'product-images',
  impl: () =>
    import('./images.component').then((m) => m.ProductImagesComponent),
});
