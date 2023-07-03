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
   * Redirect the user when enableRedirect is `true`.
   */
  enableRedirect?: boolean;

  /**
   * Render forgot password link in the UI.
   */
  forgotPasswordLink?: string;

  /**
   * Redirect the user to a specific url.
   *
   * This will only work in combination with the enableRedirect flag. If no `redirectUrl`
   * is provided, the user get's redirected to the referred page.
   */
  redirectUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}
