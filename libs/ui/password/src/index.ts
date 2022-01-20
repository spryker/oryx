import { PasswordInputComponent } from './password-input.component';

customElements.get('oryx-password-input') ||
  customElements.define('oryx-password-input', PasswordInputComponent);
