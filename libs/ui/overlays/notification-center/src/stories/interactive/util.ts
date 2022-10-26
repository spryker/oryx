import { NotificationComponent } from '@spryker-oryx/ui/notification';
import {
  NotificationCenterComponent,
  NotificationService,
  NotificationStrategy,
} from '../../index';
import { generateNotification } from '../util';

export const open = (strategy: NotificationStrategy = {}): string =>
  new NotificationService().getCenter().open(generateNotification(strategy));
export const getNotification = (
  center: NotificationCenterComponent,
  index = 0
): NotificationComponent | null => {
  return (center.renderRoot.children[index] as NotificationComponent) ?? null;
};
