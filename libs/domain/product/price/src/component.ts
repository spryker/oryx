import { componentDef } from '@spryker-oryx/core';

export const productPriceComponent = componentDef({
  name: 'product-price',
  impl: () => import('./price.component').then((m) => m.ProductPriceComponent),
});
