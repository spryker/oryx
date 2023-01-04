import { componentDef } from '@spryker-oryx/core';

export const authLogoutComponent = componentDef({
  name: 'auth-logout',
  impl: () => import('./logout.component').then((m) => m.AuthLogoutComponent),
});
