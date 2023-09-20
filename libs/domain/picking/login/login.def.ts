import { componentDef } from '@spryker-oryx/utilities';

export const pickingLoginComponent = componentDef({
  name: 'oryx-picking-login',
  impl: () => import('./login.component').then((m) => m.PickingLoginComponent),
});
