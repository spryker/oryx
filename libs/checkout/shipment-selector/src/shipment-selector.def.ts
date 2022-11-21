import { componentDef } from '@spryker-oryx/core';

export const checkoutShipmentSelectorComponent = componentDef({
  name: 'checkout-shipment-selector',
  impl: () =>
    import('./shipment-selector.component').then(
      (m) => m.CheckoutShipmentSelectorComponent
    ),
});
