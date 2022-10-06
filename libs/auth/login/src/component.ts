import { componentDef } from '@spryker-oryx/core';

export const authLoginComponent = componentDef({
  name: 'auth-login',
  impl: () => import('./login.component').then((m) => m.AuthLoginComponent),
});
