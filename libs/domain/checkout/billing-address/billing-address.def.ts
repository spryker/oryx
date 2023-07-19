import { componentDef } from '@spryker-oryx/utilities';

export const checkoutBillingAddressComponent = componentDef({
  name: 'oryx-checkout-billing-address',
  impl: () =>
    import('./billing-address.component').then(
      (m) => m.CheckoutBillingAddressComponent
    ),
  schema: () =>
    import('./billing-address.schema').then(
      (m) => m.checkoutBillingAddressSchema
    ),
});
