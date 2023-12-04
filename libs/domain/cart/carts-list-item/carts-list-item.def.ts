import { componentDef } from '@spryker-oryx/utilities';

export const cartsListItemComponent = componentDef({
  name: 'oryx-carts-list-item',
  impl: () =>
    import('./carts-list-item.component').then((m) => m.CartsListItemComponent),
});
