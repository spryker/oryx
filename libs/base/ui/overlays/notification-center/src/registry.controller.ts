import { LitElement, ReactiveController } from 'lit';
import { NotificationRegistry, Notification } from './notification-center.model';
import { AlertType } from '@spryker-oryx/ui';

const AUTO_REMOVE_TIME = 8000;
/**
 * The time that is take before the notification is removed from the DOM. During this
 * time the notification is marked not `visible`, so that the UI can play a remove effect.
 */
const DESTROY_DELAY_TIME = 1000;

export class RegistryController implements ReactiveController {
  protected items: NotificationRegistry[] = [];
  protected autoCloseQueue: {
    [key: string]: {
      autoCloseTime?: number;
      timeout: ReturnType<typeof setTimeout>;
    };
  } = {};

  getItems(): NotificationRegistry[] {
    return this.items;
  }

  add(notification: Notification): void {
    const defaultOptions = {
      floating: true,
      closable: true,
      autoClose:
        notification.type === AlertType.Info ||
        notification.type === AlertType.Success,
    };

    const registryItem: NotificationRegistry = {
      key: Date.now(),
      ...defaultOptions,
      ...notification,
    };
    if (registryItem.autoClose) {
      this.scheduleAutoClosing(registryItem);
    }
    this.items.unshift(registryItem);
    this.host.requestUpdate();
    setTimeout(() => {
      registryItem.visible = true;
      this.host.requestUpdate();
    }, 0);
  }

  protected scheduleAutoClosing(item: NotificationRegistry): void {
    this.autoCloseQueue[item.key] = {
      autoCloseTime: item.autoCloseTime,
      timeout: setTimeout(() => {
        this.destroy(item.key);
      }, item.autoCloseTime ?? AUTO_REMOVE_TIME),
    };
  }

  constructor(public host: LitElement) {
    this.host.addController(this);
  }

  hostConnected?(): void {
    this.host.addEventListener('oryx.close', (e: any) =>
      this.onClose(e.detail.key)
    );
    this.host.addEventListener('mouseenter', () => this.onMouseEnter());
    this.host.addEventListener('mouseleave', () => this.continueAutoClose());
  }

  protected onClose(key: number): void {
    this.destroy(key);
  }

  protected onMouseEnter(): void {
    Object.keys(this.autoCloseQueue).forEach((key) => {
      clearTimeout(this.autoCloseQueue[Number(key)].timeout);
    });
  }

  protected continueAutoClose(): void {
    Object.keys(this.autoCloseQueue).forEach((key) => {
      this.autoCloseQueue[Number(key)].timeout = setTimeout(() => {
        this.destroy(Number(key));
      }, this.autoCloseQueue[Number(key)].autoCloseTime);
    });
  }

  protected destroy(key: number): void {
    const item = this.items.find((item) => item.key === key);
    if (!item) return;
    item.visible = false;
    this.host.requestUpdate();
    setTimeout(() => {
      this.remove(item);
    }, DESTROY_DELAY_TIME);
  }

  protected remove(item: NotificationRegistry): void {
    const index = this.items.indexOf(item, 0);
    if (index > -1) {
      this.items.splice(index, 1);
    }
    this.host.requestUpdate();
  }
}
