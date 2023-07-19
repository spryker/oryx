import { componentDef } from '@spryker-oryx/utilities';

export const searchProductSortComponent = componentDef({
  name: 'oryx-search-product-sort',
  impl: () =>
    import('./product-sort.component').then(
      (m) => m.SearchProductSortComponent
    ),
  schema: () =>
    import('./product-sort.schema').then((m) => m.searchProductSortSchema),
});
