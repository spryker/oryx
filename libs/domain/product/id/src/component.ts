import { componentDef } from '@spryker-oryx/core';

export const productIdComponent = componentDef({
  name: 'product-id',
  impl: () => import('./id.component').then((m) => m.ProductIdComponent),
});
