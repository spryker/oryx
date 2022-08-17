import { componentDef } from '@spryker-oryx/core';

export const productCardComponent = componentDef({
  name: 'product-card',
  impl: () => import('./card.component').then((m) => m.ProductCardComponent),
});
