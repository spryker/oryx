import { ErrorMessageComponent } from './error-message.component';

export * from './error-message.component';
export * from './error-message.styles';

customElements.get('oryx-error-message') ||
  customElements.define('oryx-error-message', ErrorMessageComponent);
