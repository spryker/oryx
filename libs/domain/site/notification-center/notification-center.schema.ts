import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { NotificationPosition } from '@spryker-oryx/ui/notification-center';
import { SiteNotificationCenterComponent } from './notification-center.component';

export const siteNotificationCenterSchema: ContentComponentSchema<SiteNotificationCenterComponent> =
  {
    type: 'oryx-site-notification-center',
    name: 'Site Notification Center',
    group: 'Site',
    icon: 'notifications',
    options: {
      position: {
        type: FormFieldType.Select,
        options: [
          { value: NotificationPosition.TopStart },
          { value: NotificationPosition.TopCenter },
          { value: NotificationPosition.TopEnd },
          { value: NotificationPosition.BottomStart },
          { value: NotificationPosition.BottomCenter },
          { value: NotificationPosition.BottomEnd },
        ],
      },
      autoCloseTime: { type: FormFieldType.Number },
      enableStacking: { type: FormFieldType.Boolean },
    },
  };
