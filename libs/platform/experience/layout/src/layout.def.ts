import { componentDef } from '@spryker-oryx/core';

export const layoutComponent = componentDef({
  name: 'oryx-layout',
  impl: () => import('./layout.component').then((m) => m.LayoutComponent),
});
