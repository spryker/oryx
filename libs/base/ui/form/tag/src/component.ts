import { componentDef } from '@spryker-oryx/utilities';

export const tagComponent = componentDef({
  name: 'oryx-tag',
  impl: () => import('./tag.component').then((m) => m.TagComponent),
});
