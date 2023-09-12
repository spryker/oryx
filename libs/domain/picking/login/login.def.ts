import { componentDef } from '@spryker-oryx/utilities';

export const loginPageComponent = componentDef({
  name: 'oryx-picking-login',
  impl: () => import('./login.component').then((m) => m.default),
});
