import { componentDef } from '@spryker-oryx/core';

export const productDescriptionComponent = componentDef({
  name: 'product-description',
  impl: () =>
    import('./description.component').then(
      (m) => m.ProductDescriptionComponent
    ),
});
