import { componentDef } from '@spryker-oryx/core';

export const tagComponent = componentDef({
  name: 'oryx-tag',
  impl: () => import('./tag.component').then((m) => m.TagComponent),
});
