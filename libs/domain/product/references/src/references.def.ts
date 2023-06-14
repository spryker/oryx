import { componentDef } from '@spryker-oryx/core';

export const productReferencesComponent = componentDef({
  name: 'oryx-product-references',
  impl: () =>
    import('./references.component').then((m) => m.ProductReferencesComponent),
  schema: () => import('./references.schema').then((m) => m.referencesSchema),
});
