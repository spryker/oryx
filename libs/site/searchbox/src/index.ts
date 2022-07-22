import { SearchboxComponent, TAG_NAME } from './searchbox.component';

export * from './controllers';
export * from './searchbox.component';
export * from './searchbox.model';
export * from './styles';

customElements.get(TAG_NAME) ||
  customElements.define(TAG_NAME, SearchboxComponent);
