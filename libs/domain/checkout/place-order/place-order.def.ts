import { componentDef } from '@spryker-oryx/utilities';

export const checkoutPlaceOrderComponent = componentDef({
  name: 'oryx-checkout-place-order',
  impl: () =>
    import('./place-order.component').then(
      (m) => m.CheckoutPlaceOrderComponent
    ),
  schema: () =>
    import('./place-order.schema').then((m) => m.checkoutPlaceOrderSchema),
});
