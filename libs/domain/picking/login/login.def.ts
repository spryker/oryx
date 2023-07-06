import { componentDef } from '@spryker-oryx/core';

export const loginPageComponent = componentDef({
  name: 'oryx-login-page',
  impl: () => import('./login.component').then((m) => m.default),
});
