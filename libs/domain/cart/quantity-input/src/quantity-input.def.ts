import { QuantityInputAttributes } from '@spryker-oryx/ui/quantity-input';
import { componentDef } from '@spryker-oryx/utilities';

declare global {
  interface FeatureOptions {
    'oryx-cart-quantity-input'?: QuantityInputAttributes;
  }
}

/** @deprecated since 1.2. Use quantity input from @spryker-oryx/ui/quantity-input*/
export const quantityInputComponent = componentDef({
  name: 'oryx-cart-quantity-input',
  impl: () =>
    import('./quantity-input.component').then((m) => m.QuantityInputComponent),
});
