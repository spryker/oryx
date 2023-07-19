import { componentDef } from '@spryker-oryx/utilities';

export const checkoutAddressComponent = componentDef({
  name: 'oryx-checkout-address',
  impl: () =>
    import('./address.component').then((m) => m.CheckoutAddressComponent),
});
