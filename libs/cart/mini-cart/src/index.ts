import { componentDef } from '@spryker-oryx/core';

export * from './mini-cart.component';
export * from './mini-cart.styles';

export const miniCartComponent = componentDef({
  name: 'mini-cart',
  impl: () => import('./mini-cart.component').then((m) => m.MiniCartComponent),
});
