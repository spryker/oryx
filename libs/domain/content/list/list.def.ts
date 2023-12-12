import { componentDef } from '@spryker-oryx/utilities';

export const listComponent = componentDef({
  name: 'oryx-content-list',
  impl: () => import('./list.component').then((m) => m.ListComponent),
  schema: () => import('./list.schema').then((m) => m.listSchema),
});
