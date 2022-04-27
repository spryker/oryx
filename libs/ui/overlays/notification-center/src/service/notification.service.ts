import {
  NotificationCenterComponent,
  TAG_NAME,
} from '../notification-center.component';
import { Positions } from '../notification-center.model';

const ensurePosition = (position?: Positions): string =>
  position ? `[position=${position}]` : '';

export class NotificationService {
  getCenter(
    parentSelector = 'body',
    position?: Positions
  ): NotificationCenterComponent {
    let center = document.querySelector<NotificationCenterComponent>(
      `${parentSelector} ${TAG_NAME}${ensurePosition(position)}`
    );

    if (!(center instanceof NotificationCenterComponent)) {
      center = this.createCenter(parentSelector, position);
    }

    return center;
  }

  protected createCenter(
    parentSelector = 'body',
    position?: Positions
  ): NotificationCenterComponent {
    const parent = document.querySelector(parentSelector);

    if (!parent) {
      throw new Error(
        'Parent element not found for the creation of a new NotificationCenter'
      );
    }

    const notificationCenter = document.createElement(TAG_NAME);

    if (position) {
      notificationCenter.setAttribute('position', position);
    }

    parent.append(notificationCenter);
    return notificationCenter as NotificationCenterComponent;
  }
}
