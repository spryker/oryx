import { componentDef } from '@spryker-oryx/utilities';

export const contentListComponent = componentDef({
  name: 'oryx-content-list',
  impl: () => import('./list.component').then((m) => m.ContentListComponent),
  schema: () => import('./list.schema').then((m) => m.contentListSchema),
});
