import { componentDef } from '@spryker-oryx/utilities';

export const layoutComponent = componentDef({
  name: 'oryx-layout',
  impl: () => import('./layout.component').then((m) => m.LayoutComponent),
});
