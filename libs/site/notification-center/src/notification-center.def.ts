import { componentDef } from '@spryker-oryx/core';

export const siteNotificationCenterComponent = componentDef({
  name: 'site-notification-center',
  impl: () =>
    import('./notification-center.component').then(
      (m) => m.SiteNotificationCenterComponent
    ),
});
