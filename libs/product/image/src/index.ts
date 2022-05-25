import { ProductImageComponent } from './image.component';

export * from './image.component';
export * from './image.styles';

customElements.get('product-image') ||
  customElements.define('product-image', ProductImageComponent);
