import { componentDef } from '@spryker-oryx/utilities';

export const cartListComponent = componentDef({
  name: 'oryx-cart-list',
  impl: () => import('./list.component').then((m) => m.CartListComponent),
});
