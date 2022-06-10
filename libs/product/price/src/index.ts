import { ProductPriceComponent } from './product-price.component';

export * from './product-price.component';
export * from './product-price.controller';
export * from './product-price.model';
export * from './product-price.styles';

customElements.get('product-price') ||
  customElements.define('product-price', ProductPriceComponent);
