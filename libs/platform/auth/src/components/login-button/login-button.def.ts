import { componentDef } from '@spryker-oryx/core';
import { LoginButtonOptions } from './login-button.model';

declare global {
  interface FeatureOptions {
    'oryx-auth-login-button'?: LoginButtonOptions;
  }
}

export const loginButtonComponent = componentDef({
  name: 'oryx-auth-login-button',
  impl: () =>
    import('./login-button.component').then((m) => m.LoginButtonComponent),
  schema: () =>
    import('./login-button.schema').then((m) => m.loginButtonComponentSchema),
});
