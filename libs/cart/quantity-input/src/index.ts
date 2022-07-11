import { QuantityInputComponent } from './quantity-input.component';

export * from './quantity-input.component';
export * from './quantity-input.styles';

customElements.get('quantity-input') ||
  customElements.define('quantity-input', QuantityInputComponent);
