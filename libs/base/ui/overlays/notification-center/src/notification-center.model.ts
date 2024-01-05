import { AlertType } from '@spryker-oryx/ui';
import { Scheme } from '@spryker-oryx/ui/notification';
import { I18nContent, I18nTranslationValue } from '@spryker-oryx/utilities';
import { TemplateResult } from 'lit';
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

export type NotificationContent =
  | I18nContent
  | HTMLElement
  | TemplateResult
  | string
  | number;

export type NotificationResolvedContent =
  | Omit<NotificationContent, 'I18nContent'>
  | I18nTranslationValue;
