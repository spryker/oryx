import { ProductMediaComponent, TAG_NAME } from './media.component';

export * from './media.component';
export * from './media.model';

customElements.get(TAG_NAME) ||
  customElements.define(TAG_NAME, ProductMediaComponent);
