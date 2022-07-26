import { ProductAttributesComponent, TAG_NAME } from './attributes.component';

export * from './attributes.component';

customElements.get(TAG_NAME) ||
  customElements.define(TAG_NAME, ProductAttributesComponent);
