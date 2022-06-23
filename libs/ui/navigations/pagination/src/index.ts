export * from './pagination.component';
export * from './pagination.controller';
export * from './pagination.model';
export * from './pagination.styles';

import { PaginationComponent } from './pagination.component';

customElements.get('oryx-pagination') ||
  customElements.define('oryx-pagination', PaginationComponent);
