import { componentDef } from '@spryker-oryx/utilities';

export const pickingSearchComponent = componentDef({
  name: 'oryx-picking-search',
  impl: () =>
    import('./search.component').then(
      (m) => m.PickingSearchComponent
    ),
  schema: () =>
    import('./search.schema').then(
      (m) => m.pickingSearchComponentSchema
    ),
});
