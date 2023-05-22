import { componentDef } from '@spryker-oryx/core';

export const checkoutGuestComponent = componentDef({
  name: 'oryx-checkout-guest',
  impl: () => import('./guest.component').then((m) => m.CheckoutGuestComponent),
});
