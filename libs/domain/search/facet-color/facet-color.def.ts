import { componentDef } from '@spryker-oryx/utilities';

export const searchColorFacetComponent = componentDef({
  name: 'oryx-search-facet-color',
  impl: () =>
    import('./facet-color.component').then((m) => m.SearchColorFacetComponent),
});
