import { componentDef } from '@spryker-oryx/core';

export * from './tag.component';
export * from './tag.styles';

export const tagComponent = componentDef({
  name: 'oryx-tag',
  impl: () => import('./tag.component').then((m) => m.TagComponent),
});
