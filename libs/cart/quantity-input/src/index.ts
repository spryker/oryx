import { componentDef } from '@spryker-oryx/core';

export * from './quantity-input.component';
export * from './quantity-input.styles';

export const quantityInputComponent = componentDef({
  name: 'quantity-input',
  impl: () =>
    import('./quantity-input.component').then((m) => m.QuantityInputComponent),
});
