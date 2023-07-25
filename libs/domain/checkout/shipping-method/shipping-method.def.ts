import { componentDef } from '@spryker-oryx/utilities';

export const checkoutShippingMethodComponent = componentDef({
  name: 'oryx-checkout-shipping-method',
  impl: () =>
    import('./shipping-method.component').then(
      (m) => m.CheckoutShippingMethodComponent
    ),
  schema: () =>
    import('./shipping-method.schema').then(
      (m) => m.checkoutShippingMethodSchema
    ),
});
