import { componentDef } from '@spryker-oryx/core';

export * from './link.component';
export * from './link.model';
export * from './link.styles';

export const contentLinkComponent = componentDef({
  name: 'content-link',
  impl: () => import('./link.component').then((m) => m.ContentLinkComponent),
});
