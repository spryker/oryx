import { componentDef } from '@spryker-oryx/core';
import { LogoutOptions } from './logout.model';

declare global {
  interface Flags {
    'auth-logout'?: LogoutOptions;
  }
}

export const authLogoutComponent = componentDef({
  name: 'auth-logout',
  impl: () => import('./logout.component').then((m) => m.AuthLogoutComponent),
});
