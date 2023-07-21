import { componentDef } from '@spryker-oryx/utilities';

export const searchFacetValueNavigationComponent = componentDef({
  name: 'oryx-search-facet-value-navigation',
  impl: () =>
    import('./facet-value-navigation.component').then(
      (m) => m.SearchFacetValueNavigationComponent
    ),
});
