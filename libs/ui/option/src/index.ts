export * from './option.component';
export * from './option.styles';

import { OptionComponent } from './option.component';

customElements.get('oryx-option') ||
  customElements.define('oryx-option', OptionComponent);
