import { componentDef } from '@spryker-oryx/core';
import { QuantityInputAttributes } from './quantity-input.model';

declare global {
  interface Flags {
    'oryx-cart-quantity-input'?: QuantityInputAttributes;
  }
}

export const quantityInputComponent = componentDef({
  name: 'oryx-cart-quantity-input',
  impl: () =>
    import('./quantity-input.component').then((m) => m.QuantityInputComponent),
  stylesheets: [
    {
      rules: () =>
        import('./quantity-input.styles').then((m) => m.screenStyles),
    },
  ],
});
