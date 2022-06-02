import { DropdownComponent, TAG_NAME } from './dropdown.component';

export * from './dropdown.component';
export * from './dropdown.model';
export * from './styles';

customElements.get(TAG_NAME) ||
  customElements.define(TAG_NAME, DropdownComponent);
