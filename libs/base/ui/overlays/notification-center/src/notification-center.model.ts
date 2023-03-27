import { Notification } from '../../notification';
export interface NotificationCenterComponentAttributes {
  /**
   * Enables to position of the notifications, i.e.:
   * - top-start
   * - top-center
   * - top-end
   * - bottom-start
   * - bottom-center
   * - bottom-end
   */
  position?: NotificationPosition;

  /**
   * Enables stacking of multiple notifications by partially overlapping them in the UI as long as the user
   * doesn't hover over the center.
   */
  stackable?: boolean;
}

export const enum NotificationPosition {
  TopStart = 'top-start',
  TopCenter = 'top-center',
  TopEnd = 'top-end',
  BottomStart = 'bottom-start',
  BottomCenter = 'bottom-center',
  BottomEnd = 'bottom-end',
}

export type NotificationRegistry = Notification & {
  key: number;
  visible?: boolean;
};
