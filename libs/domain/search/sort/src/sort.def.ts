import { componentDef } from '@spryker-oryx/core';

export const sortComponent = componentDef({
  name: 'oryx-search-product-sort',
  impl: () => import('./sort.component').then((m) => m.SortComponent),
  schema: () => import('./sort.schema').then((m) => m.sortSchema),
});
