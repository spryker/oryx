import { componentDef } from '@spryker-oryx/core';

export * from './link.component';
export * from './link.model';
export * from './link.styles';

export const linkComponent = componentDef({
  name: 'oryx-link',
  impl: () => import('./link.component').then((m) => m.LinkComponent),
});
