import { componentDef } from '@spryker-oryx/utilities';

export const cartsListComponent = componentDef({
  name: 'oryx-carts-list',
  impl: () =>
    import('./carts-list.component').then((m) => m.CartsListComponent),
});
