import { componentDef } from '@spryker-oryx/utilities';
import { QuantityInputAttributes } from './quantity-input.model';

declare global {
  interface FeatureOptions {
    'oryx-quantity-input'?: QuantityInputAttributes;
  }
}

export const quantityInputComponent = componentDef({
  name: 'oryx-quantity-input',
  impl: () =>
    import('./quantity-input.component').then((m) => m.QuantityInputComponent),
});
