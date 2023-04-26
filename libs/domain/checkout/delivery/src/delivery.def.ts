import { componentDef } from '@spryker-oryx/core';

export const checkoutDeliveryComponent = componentDef({
  name: 'oryx-checkout-delivery',
  impl: () =>
    import('./delivery.component').then((m) => m.CheckoutDeliveryComponent),
  schema: () =>
    import('./delivery.schema').then((m) => m.checkoutDeliverySchema),
});
