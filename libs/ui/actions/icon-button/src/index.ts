import { IconButtonComponent } from './icon-button.component';

export * from './icon-button.component';
export * from './icon-button.styles';

customElements.get('oryx-icon-button') ||
  customElements.define('oryx-icon-button', IconButtonComponent);
