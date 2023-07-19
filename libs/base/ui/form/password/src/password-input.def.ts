import { componentDef } from '@spryker-oryx/utilities';

export const passwordInputComponent = componentDef({
  name: 'oryx-password-input',
  impl: () =>
    import('./password-input.component').then((m) => m.PasswordInputComponent),
  stylesheets: [
    {
      rules: () =>
        import('./password-input.styles').then((m) => m.screenStyles),
    },
  ],
});
