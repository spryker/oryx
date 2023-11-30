import { componentDef } from '@spryker-oryx/utilities';

export const loginNavigationComponent = componentDef({
  name: 'oryx-auth-login-navigation',
  impl: () =>
    import('./login-navigation.component.js').then(
      (m) => m.LoginNavigationComponent
    ),
});
