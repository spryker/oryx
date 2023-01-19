import { componentDef } from '@spryker-oryx/core';
import { CheckoutGuestOptions } from './guest.model';

declare global {
  interface Flags {
    'checkout-guest'?: CheckoutGuestOptions;
  }
}

export const checkoutGuestComponent = componentDef({
  name: 'checkout-guest',
  impl: () => import('./guest.component').then((m) => m.CheckoutGuestComponent),
});
