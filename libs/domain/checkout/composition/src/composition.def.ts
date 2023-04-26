import { componentDef } from '@spryker-oryx/core';

export const checkoutCompositionComponent = componentDef({
  name: 'oryx-checkout-composition',
  impl: () =>
    import('./composition.component').then(
      (m) => m.CheckoutCompositionComponent
    ),
  schema: () =>
    import('./composition.schema').then((m) => m.checkoutCompositionSchema),
});
