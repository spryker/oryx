import { LitElement, ReactiveController } from 'lit';
import { NotificationRegistry } from './notification-center.model';

import { AlertType } from '@spryker-oryx/ui';
import { Notification } from '../../notification';

const DESTROY_DELAY_TIME = 600;

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

  add(item: Notification): void {
    const strategy = this.resolveStrategy(item);
    const registryItem: NotificationRegistry = {
      key: Date.now(),
      ...strategy,
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
    // const key = item.key as string;
    this.autoCloseQueue[item.key] = {
      autoCloseTime: item.autoCloseTime,
      timeout: setTimeout(() => {
        this.destroy(item.key);
      }, item.autoCloseTime),
    };
  }

  protected resolveStrategy(item: Notification): Notification {
    const strategy = { floating: true, closable: true, ...item };

    if (strategy.autoClose === undefined) {
      strategy.autoClose =
        strategy.type === AlertType.Info || AlertType.Success === strategy.type;
    }

    if (!strategy.closable && !strategy.autoClose) {
      strategy.closable = true;
    }
    return strategy;
  }

  constructor(public host: LitElement) {
    this.host.addController(this);
  }

  hostConnected?(): void {
    this.host.addEventListener('oryx.close', (ev: any) =>
      this.onClose(ev.detail.key)
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
