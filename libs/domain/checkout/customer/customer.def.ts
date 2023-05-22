import { componentDef } from '@spryker-oryx/core';

export const checkoutCustomerComponent = componentDef({
  name: 'oryx-checkout-customer',
  impl: () =>
    import('./customer.component').then((m) => m.CheckoutCustomerComponent),
  schema: () =>
    import('./customer.schema').then((m) => m.checkoutCustomerComponentSchema),
});
