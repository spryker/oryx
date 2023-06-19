import { componentDef } from '@spryker-oryx/core';

export const checkoutPaymentComponent = componentDef({
  name: 'oryx-checkout-payment-method',
  impl: () =>
    import('./payment-method.component').then(
      (m) => m.CheckoutPaymentMethodComponent
    ),
  schema: () =>
    import('./payment-method.schema').then(
      (m) => m.checkoutPaymentMethodSchema
    ),
});
