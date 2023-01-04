import { componentDef } from '@spryker-oryx/core';

export const checkoutPlaceOrderComponent = componentDef({
  name: 'checkout-place-order',
  impl: () =>
    import('./place-order.component').then(
      (m) => m.CheckoutPlaceOrderComponent
    ),
});
