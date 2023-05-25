import { componentDef } from '@spryker-oryx/core';
import { FacetsOptions } from './facet-navigation.model';

declare global {
  interface FeatureOptions {
    'oryx-search-facet-navigation'?: FacetsOptions;
  }
}

export const facetsComponent = componentDef({
  name: 'oryx-search-facet-navigation',
  impl: () =>
    import('./facet-navigation.component').then(
      (m) => m.SearchFacetNavigationComponent
    ),
  schema: () =>
    import('./facet-navigation.schema').then(
      (m) => m.searchFacetNavigationSchema
    ),
});
