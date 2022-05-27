import { PriceComponent } from './price.component';

export * from './price.component';
export * from './price.styles';

customElements.get('product-price') ||
  customElements.define('product-price', PriceComponent);
