import { componentDef } from '@spryker-oryx/core';
import { CheckoutCompositionOptions } from './composition.model';

declare global {
  interface FeatureOptions {
    'oryx-checkout-composition'?: CheckoutCompositionOptions;
  }
}

export const checkoutCompositionComponent = componentDef({
  name: 'oryx-checkout-composition',
  impl: () =>
    import('./composition.component').then(
      (m) => m.CheckoutCompositionComponent
    ),
});
