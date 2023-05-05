import { componentDef } from '@spryker-oryx/core';

export const pickingListsHeaderComponent = componentDef({
  name: 'oryx-picking-lists-header',
  impl: () =>
    import('./picking-lists-header.component').then(
      (m) => m.PickingListsHeaderComponent
    ),
});
