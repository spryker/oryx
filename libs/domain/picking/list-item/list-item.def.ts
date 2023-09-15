import { componentDef } from '@spryker-oryx/utilities';

export const pickingListItemComponent = componentDef({
  name: 'oryx-picking-list-item',
  impl: () =>
    import('./list-item.component').then((m) => m.PickingListItemComponent),
  schema: () =>
    import('./list-item.schema').then((m) => m.pickingListItemComponentSchema),
});
