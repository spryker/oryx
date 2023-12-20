import { componentDef } from '@spryker-oryx/utilities';

export const cartListComponent = componentDef({
  name: 'oryx-cart-list',
  impl: () => import('./list.component').then((m) => m.CartListComponent),
  schema: () => import('./list.schema').then((m) => m.cartListComponentSchema),
});
