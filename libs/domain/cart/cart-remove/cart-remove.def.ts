import { componentDef } from '@spryker-oryx/utilities';

export const cartRemoveComponent = componentDef({
  name: 'oryx-cart-remove',
  impl: () =>
    import('./cart-remove.component').then((m) => m.CartRemoveComponent),
});
