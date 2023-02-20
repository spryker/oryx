import { SimpleApp } from './app';
import {
  App,
  AppBuilder,
  AppPlugin,
  isAppPluginAfterApply,
  isAppPluginBeforeApply,
} from './app.model';

/**
 * Creates application. Plugins can be added with chaining.
 */
export class SimpleAppBuilder implements AppBuilder {
  protected readonly plugins: AppPlugin[] = [];

  with(...plugins: AppPlugin[]): this {
    this.plugins.push(...plugins);
    return this;
  }

  async create(): Promise<App> {
    const app = this.createApp();

    await this.forEveryPlugin((plugin) => {
      app.registerPlugin(plugin);
      if (isAppPluginBeforeApply(plugin)) {
        return plugin.beforeApply(app);
      }
    });

    await this.forEveryPlugin((plugin) => {
      return plugin.apply(app);
    });

    await this.forEveryPlugin((plugin) => {
      if (isAppPluginAfterApply(plugin)) {
        return plugin.afterApply(app);
      }
    });

    app.markReady();

    return app;
  }

  protected createApp(): SimpleApp {
    return new SimpleApp();
  }

  protected async forEveryPlugin(
    runner: (plugin: AppPlugin) => void | Promise<void>
  ): Promise<void> {
    await Promise.all(this.plugins.map(runner));
  }
}
