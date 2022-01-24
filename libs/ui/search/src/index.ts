export * from './icons';
export * from './search.component';
export * from './search.controller';
export * from './search.mixin';
export * from './search.model';
export * from './search.styles';

import { SearchComponent } from './search.component';

customElements.get('oryx-search') ||
  customElements.define('oryx-search', SearchComponent);
