import { componentDef } from '@spryker-oryx/core';

export const productListComponent = componentDef({
  name: 'oryx-product-related-list',
  impl: () =>
    import('./category-related-list.component').then(
      (m) => m.ProductCategoryRelatedListComponent
    ),
  schema: () =>
    import('./category-related-list.schema').then(
      (m) => m.productCategoryRelatedListSchema
    ),
});
