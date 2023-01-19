import { componentDef } from '@spryker-oryx/core';
import { FacetsOptions } from './facet-navigation.model';

declare global {
  interface FeatureOptions {
    'search-facet-navigation'?: FacetsOptions;
  }
}

export const facetsComponent = componentDef({
  name: 'search-facet-navigation',
  impl: () =>
    import('./facet-navigation.component').then(
      (m) => m.SearchFacetNavigationComponent
    ),
});
