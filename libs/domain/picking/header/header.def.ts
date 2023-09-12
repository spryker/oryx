import { componentDef } from '@spryker-oryx/utilities';

export const headerComponent = componentDef({
  name: 'oryx-picking-header',
  impl: () => import('./header.component').then((m) => m.HeaderComponent),
});
