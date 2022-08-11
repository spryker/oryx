import { componentDef } from '@spryker-oryx/core';

export * from './micro-frontend';

export const microFrontendComponent = componentDef({
  name: 'oryx-micro-frontend',
  impl: () => import('./micro-frontend').then((m) => m.MicroFrontendComponent),
});
