import { componentDef } from '@spryker-oryx/core';

export const pickingListListComponent = componentDef({
  name: 'oryx-picking-lists',
  impl: () =>
    import('./picking-lists.component').then((m) => m.PickingListsComponent),
});
