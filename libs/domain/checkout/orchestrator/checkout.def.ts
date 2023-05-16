import { componentDef } from '@spryker-oryx/core';

export const checkoutComponent = componentDef({
  name: 'oryx-checkout',
  impl: () => import('./checkout.component').then((m) => m.CheckoutComponent),
  schema: () => import('./checkout.schema').then((m) => m.checkoutSchema),
});
