import { componentDef } from '@spryker-oryx/core';
import { SiteNotificationCenterOptions } from './notification-center.model';

declare global {
  interface FeatureOptions {
    'site-notification-center'?: SiteNotificationCenterOptions;
  }
}

export const siteNotificationCenterComponent = componentDef({
  name: 'site-notification-center',
  impl: () =>
    import('./notification-center.component').then(
      (m) => m.SiteNotificationCenterComponent
    ),
});
