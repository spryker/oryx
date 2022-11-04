import { componentDef } from '@spryker-oryx/core';

export const checkoutLoginComponent = componentDef({
  name: 'checkout-login',
  impl: () => import('./login.component').then((m) => m.CheckoutLoginComponent),
});
