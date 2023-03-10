import { componentDef } from '@spryker-oryx/core';
import { SiteNotificationCenterOptions } from './notification-center.model';

declare global {
  interface FeatureOptions {
    'oryx-site-notification-center'?: SiteNotificationCenterOptions;
  }
}

export const siteNotificationCenterComponent = componentDef({
  name: 'oryx-site-notification-center',
  impl: () =>
    import('./notification-center.component').then(
      (m) => m.SiteNotificationCenterComponent
    ),
  schema: () =>
    import('./notification-center.schema').then(
      (m) => m.siteNotificationCenterSchema
    ),
});
