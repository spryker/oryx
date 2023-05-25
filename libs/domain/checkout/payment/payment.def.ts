import { componentDef } from '@spryker-oryx/core';

export const checkoutPaymentComponent = componentDef({
  name: 'oryx-checkout-payment',
  impl: () =>
    import('./payment.component').then((m) => m.CheckoutPaymentComponent),
  schema: () => import('./payment.schema').then((m) => m.checkoutPaymentSchema),
});
