import { componentDef } from '@spryker-oryx/core';
import { LoginOptions } from './login.model';
import { loginComponentTag } from './login.schema';

declare global {
  interface FeatureOptions {
    [loginComponentTag]?: LoginOptions;
  }
}

export const authLoginComponent = componentDef({
  name: loginComponentTag,
  impl: () => import('./login.component').then((m) => m.AuthLoginComponent),
  schema: () => import('./login.schema').then((m) => m.loginComponentSchema),
});
