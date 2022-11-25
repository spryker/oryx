import { componentDef } from '@spryker-oryx/core';

export const checkoutDeliveryComponent = componentDef({
  name: 'checkout-delivery',
  impl: () =>
    import('./delivery.component').then((m) => m.CheckoutDeliveryComponent),
});
