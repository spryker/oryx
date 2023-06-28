import { componentDef } from '@spryker-oryx/core';

export const contentTextComponent = componentDef({
  name: 'oryx-content-text',
  impl: () => import('./text.component').then((m) => m.ContentTextComponent),
  schema: () => import('./text.schema').then((m) => m.contentTextSchema),
});
