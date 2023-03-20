import { NotificationCenterComponent } from '../notification-center.component';
import { NotificationPosition } from '../notification-center.model';
import { TAG_NAME } from '../tag';

const ensurePosition = (position?: NotificationPosition): string =>
  position ? `[position=${position}]` : '';

export class NotificationService {
  getCenter(
    parentSelector = 'body',
    position?: NotificationPosition
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
    position?: NotificationPosition
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
