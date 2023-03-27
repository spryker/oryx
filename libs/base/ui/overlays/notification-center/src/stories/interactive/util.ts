import { NotificationComponent } from '@spryker-oryx/ui/notification';
import {
  Notification,
  NotificationCenterComponent,
  NotificationService,
} from '../../index';
import { generateNotification } from '../util';

export const open = (strategy: Notification = {}): string =>
  new NotificationService().getCenter().open(generateNotification(strategy));
export const getNotification = (
  center: NotificationCenterComponent,
  index = 0
): NotificationComponent | null => {
  return (center.renderRoot.children[index] as NotificationComponent) ?? null;
};
