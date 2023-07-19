import { componentDef } from '@spryker-oryx/utilities';
import { SearchFacetNavigationOptions } from './facet-navigation.model';

declare global {
  interface FeatureOptions {
    'oryx-search-facet-navigation'?: SearchFacetNavigationOptions;
  }
}

export const searchFacetNavigationComponent = componentDef({
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
