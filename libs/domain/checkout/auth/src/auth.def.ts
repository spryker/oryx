import { componentDef } from '@spryker-oryx/core';
import { CheckoutAuthOptions } from './auth.model';

declare global {
  interface FeatureOptions {
    'checkout-auth'?: CheckoutAuthOptions;
  }
}

export const checkoutAuthComponent = componentDef({
  name: 'checkout-auth',
  impl: () => import('./auth.component').then((m) => m.CheckoutAuthComponent),
});
