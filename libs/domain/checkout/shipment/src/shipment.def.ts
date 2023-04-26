import { componentDef } from '@spryker-oryx/core';

export const checkoutShipmentComponent = componentDef({
  name: 'oryx-checkout-shipment',
  impl: () =>
    import('./shipment.component').then((m) => m.CheckoutShipmentComponent),
});
