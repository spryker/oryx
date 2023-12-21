import { componentDef } from '@spryker-oryx/utilities';

export const cartListItemComponent = componentDef({
  name: 'oryx-cart-list-item',
  impl: () =>
    import('./list-item.component').then((m) => m.CartListItemComponent),
});
