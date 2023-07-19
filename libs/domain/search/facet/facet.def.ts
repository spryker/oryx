import { componentDef } from '@spryker-oryx/utilities';

export const searchFacetComponent = componentDef({
  name: 'oryx-search-facet',
  impl: () => import('./facet.component').then((m) => m.SearchFacetComponent),
});
