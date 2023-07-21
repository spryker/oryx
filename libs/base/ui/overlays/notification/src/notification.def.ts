import { componentDef } from '@spryker-oryx/utilities';

export const notificationComponent = componentDef({
  name: 'oryx-notification',
  impl: () =>
    import('./notification.component').then((m) => m.NotificationComponent),
});
