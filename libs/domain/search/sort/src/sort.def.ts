import { componentDef } from '@spryker-oryx/core';

export const sortComponent = componentDef({
  name: 'search-product-sort',
  impl: () => import('./sort.component').then((m) => m.SortComponent),
});
