import {
  NotificationCenterComponent,
  TAG_NAME,
} from './notification-center.component';

export * from './notification-center.component';
export * from './notification-center.model';
export * from './notification-center.styles';
export * from './registry.controller';
export * from './service';

customElements.get(TAG_NAME) ||
  customElements.define(TAG_NAME, NotificationCenterComponent);
