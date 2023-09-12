import { componentDef } from '@spryker-oryx/utilities';

export const listItemComponent = componentDef({
  name: 'oryx-picking-list-item',
  impl: () => import('./list-item.component').then((m) => m.ListItemComponent),
  schema: () =>
    import('./list-item.schema').then((m) => m.listItemComponentSchema),
});
