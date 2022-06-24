import { AddToCartComponent } from './add-to-cart.component';

export * from './add-to-cart.component';
export * from './add-to-cart.model';
export * from './add-to-cart.styles';

customElements.get('add-to-cart') ||
  customElements.define('add-to-cart', AddToCartComponent);
