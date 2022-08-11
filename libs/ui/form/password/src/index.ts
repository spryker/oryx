import { componentDef } from '@spryker-oryx/core';

export * from './password-input.component';
export * from './password-input.model';
export * from './password-input.styles';

export const passwordInputComponent = componentDef({
  name: 'oryx-password-input',
  impl: () =>
    import('./password-input.component').then((m) => m.PasswordInputComponent),
});
