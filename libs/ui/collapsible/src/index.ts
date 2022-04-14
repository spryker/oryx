import { CollapsibleComponent, TAG_NAME } from './collapsible.component';

export * from './collapsible.component';
export * from './collapsible.model';
export * from './styles';

customElements.get(TAG_NAME) ||
  customElements.define(TAG_NAME, CollapsibleComponent);
