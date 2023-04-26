import { componentDef } from '@spryker-oryx/core';

export const checkoutContactComponent = componentDef({
  name: 'oryx-checkout-contact',
  impl: () =>
    import('./contact.component').then((m) => m.CheckoutContactComponent),
});
