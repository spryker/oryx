import { componentDef } from '@spryker-oryx/core';

export const notificationComponent = componentDef({
  name: 'oryx-notification',
  impl: () =>
    import('./notification.component').then((m) => m.NotificationComponent),
});
