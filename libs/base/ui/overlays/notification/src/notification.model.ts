import { AlertType } from '@spryker-oryx/ui';
import { TemplateResult } from 'lit';

export interface NotificationComponentAttributes {
  /**
   * The type of the notification is used to render an icon in the
   * notification. By default, info, success, warning and error types
   * are supported.
   */
  type?: AlertType;

  /**
   * Indicates whether a close button is rendered for the user.
   */
  closable?: boolean;

  /**
   * Indicate whether the notification should float, which is a UI
   * pattern that comes with a drop shadow and floats over other elements
   * on the page.
   */
  floating?: boolean;

  /**
   * The scheme is used to create a _light_ or _dark_ UI.
   */
  scheme?: Scheme;

  /**
   * The (optional) key is used to generate a close event. The event is
   * only used inside a notification center to remove the notification from
   * the list of notifications.
   */
  key?: string;
  /**
   * Indicates whether the notification is visible. This property is used
   * for notifications inside a notification-center, where notifications
   * are animated in and out. To support the transition, the notification is
   * marked invisible initially and before it's removed from the DOM.
   */
  visible?: boolean;
}

export interface NotificationEvent {
  key?: string;
}

/** 
 * @deprecated since 1.4. 
 * Interfaced was moved to the '@spryker-oryx/ui/notification-center'
 * and must be imported from there.
 */
export type Notification = {
  type?: AlertType;
  scheme?: Scheme;
  closable?: boolean;
  floating?: boolean;
  autoClose?: boolean;
  autoCloseTime?: number;
  content?: NotificationContent;
  subtext?: NotificationContent;
};

/** 
 * @deprecated since 1.4. 
 * Interfaced was moved to the '@spryker-oryx/ui/notification-center'
 * and must be imported from there.
 */
export type NotificationContent =
  | HTMLElement
  | TemplateResult
  | string
  | number;

export const enum Scheme {
  Light = 'light',
  Dark = 'dark',
}

export const CLOSE_EVENT = 'oryx.close';
