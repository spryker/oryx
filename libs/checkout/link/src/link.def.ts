import { componentDef } from '@spryker-oryx/core';

export const checkoutLinkComponent = componentDef({
  name: 'checkout-link',
  impl: () => import('./link.component').then((m) => m.CheckoutLinkComponent),
});
