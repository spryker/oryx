import { componentDef } from '@spryker-oryx/core';

export * from './logout.component';
export * from './logout.model';

export const userLogoutComponent = componentDef({
  name: 'user-logout',
  impl: () => import('./logout.component').then((m) => m.UserLogoutComponent),
});
