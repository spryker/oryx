import { componentDef } from '@spryker-oryx/core';

export const miniCartComponent = componentDef({
  name: 'mini-cart',
  impl: () => import('./mini-cart.component').then((m) => m.MiniCartComponent),
});
