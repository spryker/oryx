import { componentDef } from '@spryker-oryx/utilities';

export const searchRatingFacetComponent = componentDef({
  name: 'oryx-search-rating-facet',
  impl: () =>
    import('./facet-rating.component').then(
      (m) => m.SearchRatingFacetComponent
    ),
});
