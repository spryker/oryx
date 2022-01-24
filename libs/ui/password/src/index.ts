import { PasswordInputComponent } from './password-input.component';
export * from './icons';
export * from './password-input.component';
export * from './password-input.model';
export * from './password-input.styles';

customElements.get('oryx-password-input') ||
  customElements.define('oryx-password-input', PasswordInputComponent);
