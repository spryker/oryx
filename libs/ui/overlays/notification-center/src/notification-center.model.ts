import { Schemes, Types } from '@spryker-oryx/ui/notification';
import { TemplateResult } from 'lit';

export enum Positions {
  TOP_START = 'top-start',
  TOP_END = 'top-end',
  BOTTOM_START = 'bottom-start',
  BOTTOM_END = 'bottom-end',
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
