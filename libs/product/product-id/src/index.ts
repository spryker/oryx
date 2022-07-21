import { ProductIdComponent, TAG_NAME } from './product-id.component';

export * from './product-id.component';
export * from './product-id.model';

customElements.get(TAG_NAME) ||
  customElements.define(TAG_NAME, ProductIdComponent);
