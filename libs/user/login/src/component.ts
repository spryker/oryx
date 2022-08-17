import { componentDef } from '@spryker-oryx/core';

export const userLoginComponent = componentDef({
  name: 'user-login',
  impl: () => import('./login.component').then((m) => m.UserLoginComponent),
});
