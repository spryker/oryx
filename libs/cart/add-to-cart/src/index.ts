import { componentDef } from '@spryker-oryx/core';

export * from './add-to-cart.component';
export * from './add-to-cart.model';
export * from './add-to-cart.styles';

export const addToCartComponent = componentDef({
  name: 'add-to-cart',
  impl: () =>
    import('./add-to-cart.component').then((m) => m.AddToCartComponent),
});
