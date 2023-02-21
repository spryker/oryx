import { componentDef } from '@spryker-oryx/core';
import { LoginOptions } from './login.model';

declare global {
  interface FeatureOptions {
    'oryx-auth-login'?: LoginOptions;
  }
}

export const authLoginComponent = componentDef({
  name: 'oryx-auth-login',
  impl: () => import('./login.component').then((m) => m.AuthLoginComponent),
  schema: () => import('./login.schema').then((m) => m.loginComponentSchema),
});
