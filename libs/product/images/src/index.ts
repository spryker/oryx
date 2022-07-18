import { ProductImagesComponent } from './images.component';

export * from './images.component';
export * from './images.model';
export * from './images.styles';

customElements.get('product-images') ||
  customElements.define('product-images', ProductImagesComponent);
