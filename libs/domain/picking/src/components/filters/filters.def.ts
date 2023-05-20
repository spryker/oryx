import { componentDef } from '@spryker-oryx/core';

export const filtersComponent = componentDef({
  name: 'oryx-picking-filters',
  impl: () => import('./filters.component').then((m) => m.FiltersComponent),
});
