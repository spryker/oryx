import {
  NotificationCenterComponent,
  NotificationService,
  NotificationStrategy,
} from '../..';
import { NotificationComponent } from '../../../../../notification';
import { generateNotification } from '../util';

export const open = (strategy: NotificationStrategy = {}): void =>
  new NotificationService().getCenter().open(generateNotification(strategy));
export const getNotification = (
  center: NotificationCenterComponent,
  index = 0
): NotificationComponent | null => {
  return (center.renderRoot.children[index] as NotificationComponent) ?? null;
};
