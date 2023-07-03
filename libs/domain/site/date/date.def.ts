import { componentDef } from '@spryker-oryx/core';

export const dateComponent = componentDef({
  name: 'oryx-date',
  impl: () => import('./date.component').then((m) => m.DateComponent),
  schema: import('./date.schema').then((m) => m.siteDateSchema),
});
