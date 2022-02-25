export * from './password-input.component';
export * from './password-input.model';
export * from './password-input.styles';

import { PasswordInputComponent } from './password-input.component';

customElements.get('oryx-password-input') ||
  customElements.define('oryx-password-input', PasswordInputComponent);
