import { componentDef } from '@spryker-oryx/utilities';

export const cartEditComponent = componentDef({
  name: 'oryx-cart-edit',
  impl: () => import('./cart-edit.component').then((m) => m.CartEditComponent),
});
