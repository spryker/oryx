import { ErrorMessageComponent } from './error-message.component';

customElements.get('oryx-error-message') ||
  customElements.define('oryx-error-message', ErrorMessageComponent);
