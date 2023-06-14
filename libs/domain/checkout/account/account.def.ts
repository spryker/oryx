import { componentDef } from '@spryker-oryx/core';

export const checkoutAccountComponent = componentDef({
  name: 'oryx-checkout-account',
  impl: () =>
    import('./account.component').then((m) => m.CheckoutAccountComponent),
  schema: () =>
    import('./account.schema').then((m) => m.checkoutAccountComponentSchema),
});
