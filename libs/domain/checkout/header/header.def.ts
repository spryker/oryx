import { componentDef } from '@spryker-oryx/core';

export const checkoutHeaderComponent = componentDef({
  name: 'oryx-checkout-header',
  impl: () =>
    import('./header.component').then((m) => m.CheckoutHeaderComponent),
});
