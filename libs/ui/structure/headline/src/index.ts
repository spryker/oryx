import { HeadlineComponent, TAG_NAME } from './headline.component';

export * from './headline.component';
export * from './headline.styles';

customElements.get(TAG_NAME) ||
  customElements.define(TAG_NAME, HeadlineComponent);
