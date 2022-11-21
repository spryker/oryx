import { componentDef } from '@spryker-oryx/core';

export const addToCartComponent = componentDef({
  name: 'oryx-cart-add',
  impl: () => import('./add.component').then((m) => m.CartAddComponent),
});
