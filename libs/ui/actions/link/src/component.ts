import { componentDef } from '@spryker-oryx/core';

export const linkComponent = componentDef({
  name: 'oryx-link',
  impl: () => import('./link.component').then((m) => m.LinkComponent),
});
