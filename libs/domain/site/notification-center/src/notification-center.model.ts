import { NotificationPosition } from '@spryker-oryx/ui/notification-center';

export interface SiteNotificationCenterOptions {
  position?: NotificationPosition;

  /**
   * Enables stacking of multiple notifications by partially overlapping them in the UI
   * as long as the user doesn't hover over the center.
   */
  enableStacking?: boolean;

  /**
   * The default timeout (in seconds) that is used to close notifications that can be closed
   * automatically and have not provided a timeout.
   */
  defaultAutoCloseTime?: number;
}
