import { componentDef } from '@spryker-oryx/core';

export * from './login.component';
export * from './login.model';
export * from './login.styles';

export const userLoginComponent = componentDef({
  name: 'user-login',
  impl: () => import('./login.component').then((m) => m.UserLoginComponent),
});
