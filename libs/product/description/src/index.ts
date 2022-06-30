export * from './description.component';
export * from './description.styles';
export * from './model';
export * from './utils';

import { ProductDescriptionComponent } from './description.component';

customElements.get('product-description') ||
  customElements.define('product-description', ProductDescriptionComponent);
