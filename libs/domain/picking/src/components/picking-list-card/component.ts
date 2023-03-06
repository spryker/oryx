import { componentDef } from '@spryker-oryx/core';

export const pickingListCardComponent = componentDef({
  name: 'oryx-picking-list-card',
  impl: () =>
    import('./picking-list-card.component').then(
      (m) => m.PickingListCardComponent
    ),
});
