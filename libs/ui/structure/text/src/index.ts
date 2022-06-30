export * from './text.component';
export * from './text.model';
export * from './text.styles';

import { TextComponent } from './text.component';

customElements.get('oryx-text') ||
  customElements.define('oryx-text', TextComponent);
