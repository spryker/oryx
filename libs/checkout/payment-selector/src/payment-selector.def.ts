import { componentDef } from '@spryker-oryx/core';

export const checkoutPaymentSelectorComponent = componentDef({
  name: 'oryx-checkout-payment-selector',
  impl: () =>
    import('./payment-selector.component').then(
      (m) => m.CheckoutPaymentSelectorComponent
    ),
});
