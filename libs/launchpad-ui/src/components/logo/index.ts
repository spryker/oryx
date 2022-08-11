import { componentDef } from '@spryker-oryx/core';

export const logo = componentDef({
  name: 'oryx-lp-logo',
  impl: () => import('./logo').then((m) => m.Logo),
});
