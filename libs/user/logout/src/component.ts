import { componentDef } from '@spryker-oryx/core';

export const userLogoutComponent = componentDef({
  name: 'user-logout',
  impl: () => import('./logout.component').then((m) => m.UserLogoutComponent),
});
