import { componentDef } from '@spryker-oryx/core';

export const searchColorFacetComponent = componentDef({
  name: 'oryx-search-color-facet',
  impl: () =>
    import('./facet-color.component').then((m) => m.SearchColorFacetComponent),
});
