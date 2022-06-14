import { ProductTitleComponent } from './title.component';

export * from './title.component';
export * from './title.styles';

customElements.get('product-title') ||
  customElements.define('product-title', ProductTitleComponent);
