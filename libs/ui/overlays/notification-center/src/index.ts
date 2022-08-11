import { componentDef } from '@spryker-oryx/core';
import { TAG_NAME } from './notification-center.component';

export * from './notification-center.component';
export * from './notification-center.model';
export * from './notification-center.styles';
export * from './registry.controller';
export * from './service';

export const notificationCenterComponent = componentDef({
  name: TAG_NAME,
  impl: () =>
    import('./notification-center.component').then(
      (m) => m.NotificationCenterComponent
    ),
});
