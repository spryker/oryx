import { componentDef } from '@spryker-oryx/core';

export const productTitleComponent = componentDef({
  name: 'product-title',
  impl: () => import('./title.component').then((m) => m.ProductTitleComponent),
});
