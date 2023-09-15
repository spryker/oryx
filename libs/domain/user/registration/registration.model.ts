import {
  PasswordValidationOptions,
  PasswordVisibilityStrategy,
} from '@spryker-oryx/ui/password';

export interface RegistrationOptions extends PasswordValidationOptions {
  /**
   * Shows the password by the configured strategy.
   */
  passwordVisibility?: PasswordVisibilityStrategy;

  /**
   * The link to the terms and conditions.
   */
  termsAndConditionsLink?: string;

  /**
   * The link to the login page.
   */
  loginLink?: string;
}
