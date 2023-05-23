import { componentDef } from '@spryker-oryx/core';

export const productBrandComponent = componentDef({
  name: 'oryx-product-brand',
  impl: () => import('./brand.component').then((m) => m.ProductBrandComponent),
  schema: () => import('./brand.schema').then((m) => m.productBrandSchema),
});
