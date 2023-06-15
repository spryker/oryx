import { componentDef } from '@spryker-oryx/core';

export const searchFacetComponent = componentDef({
  name: 'oryx-search-facet',
  impl: () => import('./facet.component').then((m) => m.SearchFacetComponent),
});
