import { PasswordControlComponent } from './password-control.component';

customElements.get('oryx-password-control') ||
  customElements.define('oryx-password-control', PasswordControlComponent);
