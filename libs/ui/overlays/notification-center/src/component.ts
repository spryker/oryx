import { componentDef } from '@spryker-oryx/core';
import { TAG_NAME } from './utilities';

export const notificationCenterComponent = componentDef({
  name: TAG_NAME,
  impl: () =>
    import('./notification-center.component').then(
      (m) => m.NotificationCenterComponent
    ),
});
