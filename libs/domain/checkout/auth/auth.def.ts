import { componentDef } from '@spryker-oryx/core';

export const checkoutGuestComponent = componentDef({
  name: 'oryx-checkout-auth',
  impl: () => import('./auth.component').then((m) => m.CheckoutAuthComponent),
  schema: () =>
    import('./auth.schema').then((m) => m.authCheckoutComponentSchema),
});
