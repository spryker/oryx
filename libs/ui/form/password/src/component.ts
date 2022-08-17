import { componentDef } from '@spryker-oryx/core';

export const passwordInputComponent = componentDef({
  name: 'oryx-password-input',
  impl: () =>
    import('./password-input.component').then((m) => m.PasswordInputComponent),
});
