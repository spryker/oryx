import { componentDef } from '@spryker-oryx/utilities';

export const headerComponent = componentDef({
  name: 'oryx-header',
  impl: () => import('./header.component').then((m) => m.HeaderComponent),
});
