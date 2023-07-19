import { componentDef } from '@spryker-oryx/utilities';

export const pickingListsHeaderComponent = componentDef({
  name: 'oryx-picking-lists-header',
  impl: () =>
    import('./picking-lists-header.component').then(
      (m) => m.PickingListsHeaderComponent
    ),
});
