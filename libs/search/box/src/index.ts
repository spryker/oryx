import { SearchBoxComponent, TAG_NAME } from './box.component';

export * from './box.component';
export * from './box.model';
export * from './controllers';
export * from './styles';

customElements.get(TAG_NAME) ||
  customElements.define(TAG_NAME, SearchBoxComponent);
