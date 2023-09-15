import { componentDef } from '@spryker-oryx/utilities';

export const pickingFiltersComponent = componentDef({
  name: 'oryx-picking-filters',
  impl: () =>
    import('./filters.component').then((m) => m.PickingFiltersComponent),
});
