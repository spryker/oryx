import { componentDef } from '@spryker-oryx/utilities';

export const listsComponent = componentDef({
  name: 'oryx-picking-lists',
  impl: () => import('./lists.component').then((m) => m.ListsComponent),
  schema: () => import('./lists.schema').then((m) => m.listsComponentSchema),
});
