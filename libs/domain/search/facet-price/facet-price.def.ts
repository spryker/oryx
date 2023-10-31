import { componentDef } from '@spryker-oryx/utilities';

export const searchPriceFacetComponent = componentDef({
  name: 'oryx-search-price-facet',
  impl: () =>
    import('./facet-price.component').then((m) => m.SearchPriceFacetComponent),
});
