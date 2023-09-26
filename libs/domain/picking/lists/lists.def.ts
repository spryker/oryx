import { componentDef } from '@spryker-oryx/utilities';

export const pickingListsComponent = componentDef({
  name: 'oryx-picking-lists',
  impl: () => import('./lists.component').then((m) => m.PickingListsComponent),
  schema: () =>
    import('./lists.schema').then((m) => m.pickingListsComponentSchema),
});
