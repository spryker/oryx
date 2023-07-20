import { componentDef } from '@spryker-oryx/utilities';

export const iconComponent = componentDef({
  name: 'oryx-icon',
  impl: () => import('./icon.component').then((m) => m.IconComponent),
});
