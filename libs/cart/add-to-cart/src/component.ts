import { componentDef } from '@spryker-oryx/core';

export const addToCartComponent = componentDef({
  name: 'add-to-cart',
  impl: () =>
    import('./add-to-cart.component').then((m) => m.AddToCartComponent),
});
