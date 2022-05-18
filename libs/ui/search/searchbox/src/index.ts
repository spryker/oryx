export * from './searchbox.component';
export * from './searchbox.controller';
export * from './searchbox.model';
export * from './searchbox.styles';

import { SearchboxComponent } from './searchbox.component';

customElements.get('oryx-search') ||
  customElements.define('oryx-search', SearchboxComponent);
