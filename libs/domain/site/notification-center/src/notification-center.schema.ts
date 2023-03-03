import { ContentComponentSchema } from '@spryker-oryx/experience';
import { NotificationPosition } from '@spryker-oryx/ui/notification-center';
import { SiteNotificationCenterComponent } from './notification-center.component';

export const siteNotificationCenterSchema: ContentComponentSchema<SiteNotificationCenterComponent> =
  {
    type: 'oryx-site-notification-center',
    name: 'Site Notification Center',
    group: 'Site',
    options: {
      position: {
        type: 'select',
        options: [
          { value: NotificationPosition.TopStart },
          { value: NotificationPosition.TopCenter },
          { value: NotificationPosition.TopEnd },
          { value: NotificationPosition.BottomStart },
          { value: NotificationPosition.BottomCenter },
          { value: NotificationPosition.BottomEnd },
        ],
      },
      maxWidth: { type: 'text' },
      marginBlock: { type: 'text' },
      marginInline: { type: 'text' },
      enableStacking: { type: 'boolean' },
    },
  };
