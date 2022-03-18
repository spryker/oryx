export * from './events.controller';
export * from './notification.component';
export * from './notification.model';
export * from './notification.styles';

import { NotificationComponent, TAG_NAME } from './notification.component';

customElements.get(TAG_NAME) ||
  customElements.define(TAG_NAME, NotificationComponent);
