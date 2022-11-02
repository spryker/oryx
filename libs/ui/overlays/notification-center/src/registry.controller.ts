import { LitElement, ReactiveController } from 'lit';
import { defaultStrategy } from './notification-center.component';
import { NotificationRegistry } from './notification-center.model';

const createKey = (registry: NotificationRegistry[]): string => {
  return String(
    Number(
      registry
        .filter(({ key }) => !!key)
        .sort((a, b) => Number(b.key) - Number(a.key))[0]?.key || Date.now()
    ) + 1
  );
};

export class RegistryController implements ReactiveController {
  private _registry: NotificationRegistry[] = [];
  private _delayedCallbacks: { [key: string]: NodeJS.Timeout } = {};

  set registry(newRegistry: NotificationRegistry[]) {
    //need to add keys and delayed callback to the new Notification items
    const newRegistryWithParams: NotificationRegistry[] = newRegistry.map(
      (item): NotificationRegistry => {
        if (!item.key) {
          //get last key or generate new one
          const key = createKey(this.registry);

          const mergedStrategy = {
            ...defaultStrategy,
            ...item,
          };

          //add auto-close handler
          if (mergedStrategy.autoClose) {
            this._delayedCallbacks[key] = setTimeout(() => {
              this.toggleVisibility(key);
            }, mergedStrategy.autoCloseTime);
          }

          return {
            ...mergedStrategy,
            key,
            visible: false,
          };
        }

        return item;
      }
    );

    this._registry = newRegistryWithParams;
    this.host.requestUpdate();
  }

  get registry(): NotificationRegistry[] {
    return this._registry;
  }

  preventAutoClose(targetKey: string): void {
    if (this.notificationIsVisible(targetKey)) {
      clearTimeout(this._delayedCallbacks[targetKey]);
      return;
    }

    this.toggleVisibility(targetKey);
  }

  handleNotificationClose(key: string): void {
    this.removeFromRegistry(key, true);
  }

  handleTransitionEnd(key: string): void {
    if (!this.notificationIsVisible(key)) {
      this.removeFromRegistry(key);
    }
  }

  protected removeFromRegistry(targetKey: string, force = false): void {
    if (force) {
      //should clear the delayed callback
      this.preventAutoClose(targetKey);
    }
    this.registry = this.registry.filter(({ key }) => targetKey !== key);
  }

  protected toggleVisibility(targetKey: string): void {
    this.registry = this.registry.map((item) => {
      if (item.key === targetKey) {
        return {
          ...item,
          visible: !item.visible,
          _mounted: true,
        };
      }

      return item;
    });
  }

  protected notificationIsVisible(targetKey: string): boolean {
    return Boolean(
      (
        this.registry.find(
          ({ key }) => key === targetKey
        ) as NotificationRegistry
      )?.visible
    );
  }

  //need to set visible attr to true for new notifications to run animation
  protected ensureNotificationMountedState(): void {
    if (this.registry.some(({ key, _mounted }) => key && !_mounted)) {
      setTimeout(() => {
        this.registry = this.registry.map((strategy) => ({
          ...strategy,
          visible: true,
          _mounted: true,
        }));
      }, 0);
    }
  }

  constructor(public host: LitElement) {
    this.host.addController(this);
  }

  hostUpdated(): void {
    this.ensureNotificationMountedState();
  }

  hostConnected?(): void;
}
