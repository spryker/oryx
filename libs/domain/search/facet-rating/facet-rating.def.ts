import { componentDef } from '@spryker-oryx/utilities';

export const searchRatingFacetComponent = componentDef({
  name: 'oryx-search-facet-rating',
  impl: () =>
    import('./facet-rating.component').then(
      (m) => m.SearchRatingFacetComponent
    ),
});
