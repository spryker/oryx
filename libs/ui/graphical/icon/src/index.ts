import { componentDef } from '@spryker-oryx/core';

export * from './icon.component';
export * from './icon.factory';
export * from './icon.model';

export const iconComponent = componentDef({
  name: 'oryx-icon',
  impl: () => import('./icon.component').then((m) => m.IconComponent),
});
