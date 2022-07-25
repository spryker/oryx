import { ProductIdComponent, TAG_NAME } from './id.component';

export * from './id.component';
export * from './id.model';

customElements.get(TAG_NAME) ||
  customElements.define(TAG_NAME, ProductIdComponent);
