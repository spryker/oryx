import { componentDef } from '@spryker-oryx/utilities';
import { LoginLinkOptions } from './login-link.model';

declare global {
  interface FeatureOptions {
    'oryx-auth-login-link'?: LoginLinkOptions;
  }
}

export const loginLinkComponent = componentDef({
  name: 'oryx-auth-login-link',
  impl: () =>
    import('./login-link.component').then((m) => m.LoginLinkComponent),
  schema: () =>
    import('./login-link.schema').then((m) => m.loginLinkComponentSchema),
});
