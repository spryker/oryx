import { componentDef, featureVersion } from '@spryker-oryx/utilities';
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
  stylesheets:
    featureVersion >= '1.3'
      ? [
          {
            rules: () => import('./login.styles').then((m) => m.screenStyles),
          },
        ]
      : [],
});
