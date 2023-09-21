import { componentDef } from '@spryker-oryx/utilities';

export const searchColorRangeComponent = componentDef({
  name: 'oryx-search-range-facet',
  impl: () =>
    import('./facet-range.component').then((m) => m.SearchRangeFacetComponent),
});
