import { componentDef } from '@spryker-oryx/core';

export const contentLinkComponent = componentDef({
  name: 'content-link',
  impl: () => import('./link.component').then((m) => m.ContentLinkComponent),
});
