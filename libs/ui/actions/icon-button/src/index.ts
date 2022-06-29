export * from './icon-button.component';
export * from './icon-button.model';
export * from './icon-button.styles';

import { IconButtonComponent } from './icon-button.component';

customElements.get('oryx-icon-button') ||
  customElements.define('oryx-icon-button', IconButtonComponent);
