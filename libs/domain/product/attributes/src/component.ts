import { componentDef } from '@spryker-oryx/core';

export const productAttributesComponent = componentDef({
  name: 'product-attributes',
  impl: () =>
    import('./attributes.component').then((m) => m.ProductAttributesComponent),
});
