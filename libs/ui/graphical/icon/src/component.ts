import { componentDef } from '@spryker-oryx/core';

export const iconComponent = componentDef({
  name: 'oryx-icon',
  impl: () => import('./icon.component').then((m) => m.IconComponent),
});
