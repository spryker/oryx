import { ProductDescriptionComponent } from './description.component';

export * from './description.component';
export * from './description.styles';
export * from './model';

customElements.get('product-description') ||
  customElements.define('product-description', ProductDescriptionComponent);
