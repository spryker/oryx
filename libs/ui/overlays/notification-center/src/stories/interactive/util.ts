import {
  NotificationCenterComponent,
  NotificationService,
  NotificationStrategy,
} from '../..';
import { NotificationComponent } from '../../../../../notification';
import { generateNotification } from '../util';

export const open = (strategy: NotificationStrategy = {}): void =>
  new NotificationService().getCenter().open(generateNotification(strategy));
export const wait = async (t: number): Promise<void> =>
  await new Promise((r) => setTimeout(r, t));
export const getNotification = (
  center: NotificationCenterComponent,
  index = 0
): NotificationComponent | null => {
  return (center.renderRoot.children[index] as NotificationComponent) ?? null;
};
