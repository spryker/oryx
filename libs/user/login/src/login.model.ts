import { PasswordVisibilityStrategy } from '@spryker-oryx/ui/password';

export interface LoginOptions {
  strategy?: PasswordVisibilityStrategy;
  showRememberMe?: boolean;
  url?: string;
}

export interface LoginParameters {
  email: string;
  password: string;
  rememberme: boolean;
}
