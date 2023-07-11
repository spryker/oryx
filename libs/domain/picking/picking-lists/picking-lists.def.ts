import { componentDef } from '@spryker-oryx/core';

export const pickingListsComponent = componentDef({
  name: 'oryx-picking-lists',
  impl: () =>
    import('./picking-lists.component').then((m) => m.PickingListsComponent),
  schema: () =>
    import('./picking-lists.schema').then((m) => m.pickingListsComponentSchema),
});
