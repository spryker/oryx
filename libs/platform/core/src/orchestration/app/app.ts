import { PromiseSubject, Type } from '@spryker-oryx/utilities';
import { App, AppPlugin } from './app.model';

/**
 * Indicates when application is ready. Registers plugins.
 */
export class SimpleApp implements App {
  protected readonly plugins: AppPlugin[] = [];
  protected readonly readyPromise = new PromiseSubject<SimpleApp>();

  whenReady(): Promise<SimpleApp> {
    return this.readyPromise.asPromise();
  }

  findPlugin<T extends AppPlugin>(nameOrType: string | Type<T>): T | undefined {
    const pluginByNameOrType: (plugin: AppPlugin) => boolean =
      typeof nameOrType === 'string'
        ? (plugin): boolean => plugin.getName() === nameOrType
        : (plugin): boolean => plugin instanceof nameOrType;

    return this.plugins.find(pluginByNameOrType) as T;
  }

  requirePlugin<T extends AppPlugin>(nameOrType: string | Type<T>): T {
    const maybePlugin = this.findPlugin(nameOrType);

    if (!maybePlugin) {
      throw new Error(`SimpleApp: Missing required plugin '${nameOrType}'!`);
    }

    return maybePlugin;
  }

  registerPlugin(plugin: AppPlugin): void {
    this.plugins.push(plugin);
  }

  markReady(): void {
    this.readyPromise.resolve(this);
  }

  destroy(): void {
    this.plugins.forEach((plugin) => {
      plugin.destroy?.(this);
    });

    this.plugins.length = 0;
  }
}
