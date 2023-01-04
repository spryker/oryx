import { componentDef } from '@spryker-oryx/core';

export const facetsComponent = componentDef({
  name: 'search-facet-navigation',
  impl: () =>
    import('./facet-navigation.component').then(
      (m) => m.SearchFacetNavigationComponent
    ),
});
