import { PasswordVisibilityStrategy } from '@spryker-oryx/ui/password';

export interface LoginOptions {
  /**
   * Shows the password by the configured strategy.
   */
  passwordVisibility?: PasswordVisibilityStrategy;

  /**
   * Shows a remember me option in the UI when this flag is set to true.
   */
  enableRememberMe?: boolean;

  /**
   * Keeps the user at the current route when disableRedirect is `true`.
   */
  disableRedirect?: boolean;

  /**
   * Enables the forgot password link in the UI.
   */
  enableForgotPassword?: boolean;

  /**
   * Redirect the user to a specific url.
   *
   * This will only work in combination with the enableRedirect flag. If no `redirectUrl`
   * is provided, the user get's redirected to the referred page.
   */
  redirectUrl?: string;
}

export interface LoginParameters {
  email: string;
  password: string;
  rememberMe: boolean;
}
