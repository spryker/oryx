import { componentDef } from '@spryker-oryx/core';
import { LogoutOptions } from './logout.model';

declare global {
  interface FeatureOptions {
    'oryx-auth-logout'?: LogoutOptions;
  }
}

export const authLogoutComponent = componentDef({
  name: 'oryx-auth-logout',
  impl: () => import('./logout.component').then((m) => m.default),
  schema: () =>
    import('./logout.schema').then((m) => m.authLogoutComponentSchema),
});
