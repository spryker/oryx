import { MiniCartComponent } from './mini-cart.component';

export * from './mini-cart.component';
export * from './mini-cart.styles';

customElements.get('mini-cart') ||
  customElements.define('mini-cart', MiniCartComponent);
