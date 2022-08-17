import { componentDef } from '@spryker-oryx/core';

export const quantityInputComponent = componentDef({
  name: 'quantity-input',
  impl: () =>
    import('./quantity-input.component').then((m) => m.QuantityInputComponent),
});
