import { NotificationPosition } from '@spryker-oryx/ui/notification-center';

export interface SiteNotificationCenterOptions {
  position?: NotificationPosition;

  maxWidth?: string;

  /**
   * Adds a margin to the top or bottom of the notification center.
   */
  marginBlock?: string;

  /**
   * Adds a margin to the start or end (aka left/right) of the notification center.
   */
  marginInline?: string;

  /**
   * Enables stacking of multiple notifications by partially overlapping them in the UI as long as the user
   * doesn't hover over the center.
   */
  enableStacking?: boolean;
}
