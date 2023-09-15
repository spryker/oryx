import { componentDef } from '@spryker-oryx/utilities';

export const pickingLoginPageComponent = componentDef({
  name: 'oryx-picking-login',
  impl: () => import('./login.component').then((m) => m.default),
});
