import { componentDef } from '@spryker-oryx/utilities';

export const loginPageComponent = componentDef({
  name: 'oryx-login-page',
  impl: () => import('./login.component').then((m) => m.default),
});
