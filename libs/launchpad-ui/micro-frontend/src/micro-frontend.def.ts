import { componentDef } from '@spryker-oryx/core';

export const microFrontendComponent = componentDef({
  name: 'oryx-micro-frontend',
  impl: () => import('./micro-frontend').then((m) => m.MicroFrontendComponent),
});
