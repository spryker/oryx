import { componentDef } from '@spryker-oryx/utilities';

export const miniLoginComponent = componentDef({
  name: 'oryx-auth-mini-login',
  impl: () =>
    import('./mini-login.component').then((m) => m.MiniLoginLinkComponent),
});
