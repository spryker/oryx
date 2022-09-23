import { componentDef } from '@spryker-oryx/core';

export const cartTotalsComponent = componentDef({
  name: 'cart-totals',
  impl: () => import('./totals.component').then((m) => m.CartTotalsComponent),
});
