import { componentDef } from '@spryker-oryx/core';

export * from './notification.base.styles';
export * from './notification.component';
export * from './notification.model';
export * from './notification.oryx.styles';

export const notificationComponent = componentDef({
  name: 'oryx-notification',
  impl: () =>
    import('./notification.component').then((m) => m.NotificationComponent),
});
