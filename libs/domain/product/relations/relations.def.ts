import { componentDef } from '@spryker-oryx/core';

export const productRelationsComponent = componentDef({
  name: 'oryx-product-relations',
  impl: () =>
    import('./relations.component').then((m) => m.ProductRelationsComponent),
  schema: () => import('./relations.schema').then((m) => m.relationsSchema),
});
