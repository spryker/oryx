import { componentDef } from '@spryker-oryx/core';

export const searchFacetControlComponent = componentDef({
  name: 'oryx-search-facet-value-navigation',
  impl: () =>
    import('./facet-value-navigation.component').then(
      (m) => m.SearchFacetValueNavigationComponent
    ),
});
