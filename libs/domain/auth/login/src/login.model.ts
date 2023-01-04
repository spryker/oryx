import { PasswordVisibilityStrategy } from '@spryker-oryx/ui/password';

export interface LoginOptions {
  title?: string;
  strategy?: PasswordVisibilityStrategy;
  showRememberMe?: boolean;
  url?: string;
  disableRedirect?: boolean;
}

export interface LoginParameters {
  email: string;
  password: string;
  rememberme: boolean;
}
