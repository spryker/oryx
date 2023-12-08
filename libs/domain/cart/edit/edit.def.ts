import { componentDef } from '@spryker-oryx/utilities';

export const cartEditComponent = componentDef({
  name: 'oryx-cart-edit',
  impl: () => import('./edit.component').then((m) => m.CartEditComponent),
});
