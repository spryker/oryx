import { NotificationPosition } from '@spryker-oryx/ui/notification-center';

export interface SiteNotificationCenterOptions {
  position?: NotificationPosition;

  maxWidth?: string;

  /**
   * Adds a margin to the top or bottom of the notification center,
   * depending on where it is located. If the notification is positioned at the top,
   * a margin is added to the sticky notification to move it lower on the screen. Similarly,
   * when the notification sticks at the bottom, it will have more margin at the bottom.
   */
  marginBlock?: string;
  marginInline?: string;
}
