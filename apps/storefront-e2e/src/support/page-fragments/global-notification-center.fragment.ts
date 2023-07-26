import { GlobalNotification } from './global-notification.fragment';

export class GlobalNotificationCenter {
  getWrapper = () => cy.get('oryx-site-notification-center');
  getCenter = () => this.getWrapper().find('oryx-notification-center');
  getNotifications = () =>
    this.getCenter()
      .find('oryx-notification')
      .then((notifications) => {
        return cy.wrap(
          notifications
            .toArray()
            .map((notification) => new GlobalNotification(notification))
        );
      });
}
