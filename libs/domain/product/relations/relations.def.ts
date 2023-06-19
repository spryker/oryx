import { componentDef } from '@spryker-oryx/core';

export const productReferencesComponent = componentDef({
  name: 'oryx-product-relations',
  impl: () =>
    import('./relations.component').then((m) => m.ProductReferencesComponent),
  schema: () => import('./relations.schema').then((m) => m.relationsSchema),
});
