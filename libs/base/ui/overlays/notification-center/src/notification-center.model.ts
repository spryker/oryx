import { Schemes, Types } from '@spryker-oryx/ui/notification';
import { TemplateResult } from 'lit';

// TODO: const
export const enum NotificationPosition {
  TopStart = 'top-start',
  TopCenter = 'top-center',
  TopEnd = 'top-end',
  BottomStart = 'bottom-start',
  BottomCenter = 'bottom-center',
  BottomEnd = 'bottom-end',
}

export type NotificationStrategy = {
  type?: Types;
  scheme?: Schemes;
  closable?: boolean;
  floating?: boolean;
  autoClose?: boolean;
  autoCloseTime?: number;
  content?: NotificationContent;
  subtext?: NotificationContent;
};

export type NotificationRegistry = NotificationStrategy & {
  key?: string;
  visible?: boolean;
  _mounted?: boolean;
};

export type NotificationContent =
  | HTMLElement
  | TemplateResult
  | string
  | number;
