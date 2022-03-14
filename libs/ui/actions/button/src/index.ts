import { ButtonComponent } from './button.component';

customElements.get('oryx-button') ||
  customElements.define('oryx-button', ButtonComponent);
