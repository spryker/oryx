import { ProductCardComponent, TAG_NAME } from './card.component';

export * from './card.component';
export * from './card.model';
export * from './card.styles';

customElements.get(TAG_NAME) ||
  customElements.define(TAG_NAME, ProductCardComponent);
