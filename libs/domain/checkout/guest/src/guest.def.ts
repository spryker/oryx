import { componentDef } from '@spryker-oryx/core';

export const checkoutGuestComponent = componentDef({
  name: 'checkout-guest',
  impl: () => import('./guest.component').then((m) => m.CheckoutGuestComponent),
});
