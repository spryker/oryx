import { componentDef } from '@spryker-oryx/core';

export const productListComponent = componentDef({
  name: 'product-list',
  impl: () => import('./list.component').then((m) => m.ProductListComponent),
});
