import { componentDef } from '@spryker-oryx/core';

export const checkoutAddressComponent = componentDef({
  name: 'checkout-address',
  impl: () =>
    import('./address.component').then((m) => m.CheckoutAddressComponent),
});
