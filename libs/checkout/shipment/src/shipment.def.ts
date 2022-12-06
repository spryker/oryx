import { componentDef } from '@spryker-oryx/core';

export const checkoutShipmentComponent = componentDef({
  name: 'checkout-shipment',
  impl: () =>
    import('./shipment.component').then((m) => m.CheckoutShipmentComponent),
});
