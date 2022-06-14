import { ProductPriceComponent } from './price.component';

export * from './price.component';
export * from './price.controller';
export * from './price.model';
export * from './price.styles';

customElements.get('product-price') ||
  customElements.define('product-price', ProductPriceComponent);
